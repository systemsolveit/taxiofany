const i18nService = require('../../user/i18n/service');
const path = require('path');
const fs = require('fs');

function toSlug(value) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '')
    .slice(0, 48);
}

function toTitleCase(value) {
  return String(value || '')
    .split(/[_\-/]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

function normalizePageInfo(relativeFile) {
  const normalized = String(relativeFile || '').replace(/\\/g, '/');
  const withoutPrefix = normalized.replace(/^frontend\/views\//, '');
  const withoutExtension = withoutPrefix.replace(/\.ejs$/i, '');
  const segments = withoutExtension.split('/').filter(Boolean);
  const pageSegments = segments.length ? segments : ['general'];
  const rawPageKey = pageSegments.join('.').replace(/\.index$/i, '');
  const pageKey = rawPageKey || 'general';
  const pageId = pageKey.replace(/\./g, '-');
  const groupKey = pageSegments[0] || 'general';
  const pageLabel = toTitleCase(pageSegments[pageSegments.length - 1] === 'index' ? pageSegments.slice(0, -1).join(' ') || groupKey : pageSegments.join(' '));
  const groupLabel = toTitleCase(groupKey);

  return {
    pageKey,
    pageId,
    pageLabel,
    groupKey,
    groupLabel,
    relativePath: normalized,
  };
}

function buildSuggestedKey(relativeFile, text) {
  const pageInfo = normalizePageInfo(relativeFile);
  return `pages.${pageInfo.pageKey}.${toSlug(text) || 'keyword'}`;
}

function decodeJsQuoted(value) {
  return String(value || '')
    .replace(/\\'/g, "'")
    .replace(/\\"/g, '"')
    .replace(/\\n/g, '\n')
    .replace(/\\r/g, '\r')
    .replace(/\\t/g, '\t')
    .replace(/\\\\/g, '\\');
}

function collectTranslationFallbackHints(content) {
  const hints = [];
  const singleQuotePattern = /t\(\s*'([^']+)'\s*,\s*'((?:\\'|[^'])*)'\s*\)/g;
  const doubleQuotePattern = /t\(\s*"([^"]+)"\s*,\s*"((?:\\"|[^"])*)"\s*\)/g;
  const patterns = [singleQuotePattern, doubleQuotePattern];

  patterns.forEach((pattern) => {
    let match = pattern.exec(content);
    while (match) {
      const key = String(match[1] || '').trim();
      const fallback = normalizeComparableText(decodeJsQuoted(match[2] || ''));
      if (key && fallback) {
        hints.push({ key, fallback });
      }
      match = pattern.exec(content);
    }
  });

  return hints;
}

function buildTemplateTextKeyHints(files = []) {
  const fallbackToKey = new Map();

  files.forEach((filePath) => {
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      const hints = collectTranslationFallbackHints(content);
      hints.forEach((hint) => {
        // Prefer semantic namespaces when both semantic and extracted keys exist for the same text.
        const existingKey = fallbackToKey.get(hint.fallback);
        const existingIsPages = existingKey && existingKey.startsWith('pages.');
        const nextIsPages = hint.key.startsWith('pages.');
        if (!existingKey || (existingIsPages && !nextIsPages)) {
          fallbackToKey.set(hint.fallback, hint.key);
        }
      });
    } catch (error) {
      // Ignore parse failures for individual files and continue hint collection.
    }
  });

  return fallbackToKey;
}

function collectAllEjsFiles(viewRoots) {
  return Array.from(
    viewRoots.reduce((set, rootPath) => {
      collectEjsFiles(rootPath).forEach((filePath) => set.add(filePath));
      return set;
    }, new Set())
  );
}

function preferExistingKeyForText(hintMap, text) {
  const normalizedText = normalizeComparableText(text);
  if (!normalizedText) {
    return '';
  }

  return hintMap.get(normalizedText) || '';
}

function normalizeEntriesWithTemplateHints(entries = [], hintMap = new Map()) {
  const deduped = new Map();

  entries.forEach((entry) => {
    const nextEntry = { ...entry };
    const key = String(nextEntry && nextEntry.key ? nextEntry.key : '').trim();
    const text = String(nextEntry && nextEntry.text ? nextEntry.text : '');
    const preferredKey = preferExistingKeyForText(hintMap, text);

    if (key.startsWith('pages.') && preferredKey && preferredKey !== key) {
      nextEntry.key = preferredKey;
    }

    const cleanKey = String(nextEntry.key || '').trim();
    if (!cleanKey) {
      return;
    }

    deduped.set(cleanKey, {
      ...nextEntry,
      key: cleanKey,
    });
  });

  return Array.from(deduped.values());
}

function isUsersUiView(relativeFile) {
  const normalized = String(relativeFile || '').replace(/\\/g, '/');
  if (!normalized.startsWith('frontend/views/users/')) {
    return false;
  }

  // Ignore implementation partials to keep page coverage focused on real routed UI pages.
  if (normalized.includes('/partials/')) {
    return false;
  }

  return true;
}

function collectEjsFiles(dirPath, out = []) {
  const entries = fs.readdirSync(dirPath, { withFileTypes: true });
  entries.forEach((entry) => {
    const full = path.join(dirPath, entry.name);
    if (entry.isDirectory()) {
      collectEjsFiles(full, out);
      return;
    }
    if (entry.isFile() && entry.name.endsWith('.ejs')) {
      out.push(full);
    }
  });
  return out;
}

function resolveViewsRoots() {
  const candidates = [
    process.env.I18N_VIEWS_DIR,
    process.env.I18N_USERS_VIEWS_DIR,
    path.resolve(__dirname, '../../../../frontend/views'),
    '/frontend/views',
  ].filter(Boolean);

  const found = candidates.filter((candidate) => fs.existsSync(candidate));
  if (!found.length) {
    const error = new Error('Unable to locate users EJS views directory for extraction.');
    error.statusCode = 500;
    error.code = 'I18N_VIEWS_NOT_FOUND';
    throw error;
  }

  return found;
}

function extractTextsFromEjs(raw) {
  const withoutEjs = raw
    .replace(/<%[\s\S]*?%>/g, ' ')
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, '\n')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&#39;/g, "'")
    .replace(/&quot;/g, '"');

  const lines = withoutEjs
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .filter((line) => /[A-Za-z]/.test(line))
    .filter((line) => line.length >= 3)
    .filter((line) => !/^https?:\/\//i.test(line));

  return lines;
}

function decodeEntities(value) {
  return String(value || '')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&#39;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>');
}

function normalizeComparableText(value) {
  return decodeEntities(value)
    .replace(/\s+/g, ' ')
    .trim();
}

function escapeJsSingleQuoted(value) {
  return String(value || '').replace(/\\/g, '\\\\').replace(/'/g, "\\'");
}

function applyEntryToTemplateContent(content, entry) {
  const cleanKey = String(entry && entry.key ? entry.key : '').trim();
  const cleanText = normalizeComparableText(entry && entry.text ? entry.text : '');

  if (!cleanKey || !cleanText) {
    return { updated: false, content };
  }

  if (content.includes(`t('${cleanKey}'`) || content.includes(`t(\"${cleanKey}\"`)) {
    return { updated: false, content };
  }

  let changed = false;
  let replaced = false;
  const nextContent = content.replace(/>([\s\S]*?)</g, (match, inner) => {
    if (replaced) {
      return match;
    }

    if (!/[A-Za-z]/.test(inner)) {
      return match;
    }

    if (inner.includes('<%') || inner.includes('%>')) {
      return match;
    }

    const comparableInner = normalizeComparableText(inner);
    if (!comparableInner || comparableInner !== cleanText) {
      return match;
    }

    const leading = (inner.match(/^\s*/) || [''])[0];
    const trailing = (inner.match(/\s*$/) || [''])[0];
    const fallback = escapeJsSingleQuoted(cleanText);
    replaced = true;
    changed = true;
    return `>${leading}<%= t('${cleanKey}', '${fallback}') %>${trailing}<`;
  });

  return {
    updated: changed,
    content: nextContent,
  };
}

function applyTemplateKeys(entries = []) {
  const projectRoot = path.resolve(__dirname, '../../../../..');
  const groupedEntries = new Map();

  entries.forEach((entry) => {
    const relativeFile = String(entry && entry.file ? entry.file : '').replace(/\\/g, '/').trim();
    if (!relativeFile || !isUsersUiView(relativeFile)) {
      return;
    }

    if (!groupedEntries.has(relativeFile)) {
      groupedEntries.set(relativeFile, []);
    }

    groupedEntries.get(relativeFile).push(entry);
  });

  let filesUpdated = 0;
  let replacements = 0;
  const touchedFiles = [];
  const failures = [];

  groupedEntries.forEach((fileEntries, relativeFile) => {
    try {
      const absolutePath = path.resolve(projectRoot, relativeFile);
      if (!fs.existsSync(absolutePath)) {
        return;
      }

      let content = fs.readFileSync(absolutePath, 'utf8');
      let fileChanged = false;

      fileEntries.forEach((entry) => {
        const result = applyEntryToTemplateContent(content, entry);
        if (result.updated) {
          content = result.content;
          fileChanged = true;
          replacements += 1;
        }
      });

      if (fileChanged) {
        fs.writeFileSync(absolutePath, content, 'utf8');
        filesUpdated += 1;
        touchedFiles.push(relativeFile);
      }
    } catch (error) {
      failures.push({ file: relativeFile, message: error.message });
    }
  });

  return {
    filesUpdated,
    replacements,
    touchedFiles,
    failures,
  };
}

async function listEntries(locale) {
  return i18nService.listEntries(locale);
}

async function upsertEntry(payload) {
  return i18nService.upsertEntry(payload);
}

async function bulkUpsertEntries(payload) {
  const viewRoots = resolveViewsRoots();
  const allFiles = collectAllEjsFiles(viewRoots);
  const hintMap = buildTemplateTextKeyHints(allFiles);
  const incomingEntries = payload && Array.isArray(payload.entries) ? payload.entries : [];
  const normalizedEntries = normalizeEntriesWithTemplateHints(incomingEntries, hintMap);

  const savedEntries = await i18nService.bulkUpsertEntries({
    ...payload,
    entries: normalizedEntries,
  });
  const templateUpdates = applyTemplateKeys(normalizedEntries);

  return {
    entries: savedEntries,
    count: savedEntries.length,
    templateUpdates,
  };
}

async function listLocaleRegistry() {
  return i18nService.listLocaleRegistry();
}

async function createLocale(payload) {
  return i18nService.createLocale(payload);
}

async function updateLocale(code, payload) {
  return i18nService.updateLocale(code, payload);
}

async function isSupportedLocale(locale) {
  return i18nService.isSupportedLocale(locale);
}

function listLocales() {
  return i18nService.listSupportedLocales();
}

function listUiPages() {
  const projectRoot = path.resolve(__dirname, '../../../../..');
  const viewRoots = resolveViewsRoots();
  const files = collectAllEjsFiles(viewRoots);

  return files
    .map((filePath) => path.relative(projectRoot, filePath).replace(/\\/g, '/'))
    .filter(isUsersUiView)
    .map((relativeFile) => {
      const pageInfo = normalizePageInfo(relativeFile);
      return {
        ...pageInfo,
        file: relativeFile,
      };
    })
    .sort((left, right) => left.file.localeCompare(right.file));
}

function extractKeywords(limit = 120) {
  const projectRoot = path.resolve(__dirname, '../../../../..');
  const viewRoots = resolveViewsRoots();
  const files = collectAllEjsFiles(viewRoots);
  const hintMap = buildTemplateTextKeyHints(files);
  const seen = new Set();
  const extracted = [];

  files.forEach((filePath) => {
    const relativeFile = path.relative(projectRoot, filePath).replace(/\\/g, '/');
    if (!isUsersUiView(relativeFile)) {
      return;
    }

    const pageInfo = normalizePageInfo(relativeFile);
    const content = fs.readFileSync(filePath, 'utf8');
    const texts = extractTextsFromEjs(content);

    texts.forEach((text) => {
      const normalized = text.replace(/\s+/g, ' ').trim();
      const seenKey = `${pageInfo.pageKey}::${normalized}`;
      if (!normalized || seen.has(seenKey)) {
        return;
      }

      seen.add(seenKey);
      extracted.push({
        text: normalized,
        suggestedKey: preferExistingKeyForText(hintMap, normalized) || buildSuggestedKey(relativeFile, normalized),
        file: relativeFile,
        pageKey: pageInfo.pageKey,
        pageId: pageInfo.pageId,
        pageLabel: pageInfo.pageLabel,
        groupKey: pageInfo.groupKey,
        groupLabel: pageInfo.groupLabel,
      });
    });
  });

  return extracted.slice(0, limit);
}

async function translateSingle(text, source, target) {
  const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${encodeURIComponent(
    source
  )}&tl=${encodeURIComponent(target)}&dt=t&q=${encodeURIComponent(text)}`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      return text;
    }

    const data = await response.json();
    const translated = Array.isArray(data) && Array.isArray(data[0]) ? data[0].map((part) => part[0]).join('') : '';
    return translated || text;
  } catch (error) {
    return text;
  }
}

async function translateKeywords({ texts, source = 'en', target = 'nl' }) {
  const results = [];
  for (const text of texts) {
    const translated = await translateSingle(text, source, target);
    results.push({ text, translated });
  }
  return results;
}

/**
 * Populate a new locale by copying all translations from its base locale and
 * auto-translating them with Google Translate. Keys that already have an
 * override in the target locale are skipped to avoid overwriting manual work.
 */
async function populateLocaleFromBase(code) {
  const registry = await listLocaleRegistry();
  const localeRecord = registry.find((item) => item.code === code);

  if (!localeRecord) {
    const error = new Error('Locale not found.');
    error.statusCode = 404;
    error.code = 'LOCALE_NOT_FOUND';
    throw error;
  }

  const baseCode = localeRecord.baseLocale;
  if (!baseCode) {
    const error = new Error('This locale has no base locale set. Set a base locale first.');
    error.statusCode = 400;
    error.code = 'NO_BASE_LOCALE';
    throw error;
  }

  // Fetch all entries for the base locale (db + inherited).
  const baseEntries = await i18nService.listEntries(baseCode);

  if (!baseEntries.length) {
    return { count: 0, skipped: 0, baseLocale: baseCode };
  }

  // Determine which keys the target locale already owns to skip them.
  const Translation = require('../../../models').Translation;
  const existingDocs = await Translation.find({ locale: code }).lean();
  const existingKeys = new Set(existingDocs.map((doc) => doc.key));

  const toTranslate = baseEntries.filter((entry) => !existingKeys.has(entry.key));

  if (!toTranslate.length) {
    return { count: 0, skipped: baseEntries.length, baseLocale: baseCode };
  }

  // Translate values and bulk-save. Process in batches of 50 to avoid overwhelming the translate API.
  const BATCH = 50;
  const operations = [];

  for (let i = 0; i < toTranslate.length; i += BATCH) {
    const batch = toTranslate.slice(i, i + BATCH);
    const results = await translateKeywords({
      texts: batch.map((entry) => entry.value),
      source: baseCode,
      target: code,
    });

    results.forEach((res, idx) => {
      operations.push({
        updateOne: {
          filter: { locale: code, key: batch[idx].key },
          update: { $set: { value: res.translated, updatedBy: 'system:populate' } },
          upsert: true,
        },
      });
    });
  }

  if (operations.length) {
    await Translation.bulkWrite(operations, { ordered: false });
  }

  return {
    count: operations.length,
    skipped: existingKeys.size,
    baseLocale: baseCode,
  };
}

module.exports = {
  listEntries,
  upsertEntry,
  bulkUpsertEntries,
  listLocaleRegistry,
  createLocale,
  updateLocale,
  isSupportedLocale,
  listLocales,
  listUiPages,
  extractKeywords,
  translateKeywords,
  populateLocaleFromBase,
};
