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

function resolveUsersViewsPath() {
  const candidates = [
    process.env.I18N_USERS_VIEWS_DIR,
    path.resolve(__dirname, '../../../../../frontend/views/users'),
    '/frontend/views/users',
  ].filter(Boolean);

  const found = candidates.find((candidate) => fs.existsSync(candidate));
  if (!found) {
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

async function listEntries(locale) {
  return i18nService.listEntries(locale);
}

async function upsertEntry(payload) {
  return i18nService.upsertEntry(payload);
}

function listLocales() {
  return i18nService.listSupportedLocales();
}

function extractKeywords(limit = 120) {
  const projectRoot = path.resolve(__dirname, '../../../../..');
  const usersViewsPath = resolveUsersViewsPath();
  const files = collectEjsFiles(usersViewsPath);
  const seen = new Set();
  const extracted = [];

  files.forEach((filePath) => {
    const relativeFile = path.relative(projectRoot, filePath).replace(/\\/g, '/');
    const content = fs.readFileSync(filePath, 'utf8');
    const texts = extractTextsFromEjs(content);

    texts.forEach((text) => {
      const normalized = text.replace(/\s+/g, ' ').trim();
      if (!normalized || seen.has(normalized)) {
        return;
      }

      seen.add(normalized);
      extracted.push({
        text: normalized,
        suggestedKey: `auto.${toSlug(normalized) || 'keyword'}`,
        file: relativeFile,
      });
    });
  });

  return extracted.slice(0, limit);
}

async function translateSingle(text, source, target) {
  const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${encodeURIComponent(
    source
  )}&tl=${encodeURIComponent(target)}&dt=t&q=${encodeURIComponent(text)}`;

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error('Google translate request failed.');
  }

  const data = await response.json();
  const translated = Array.isArray(data) && Array.isArray(data[0]) ? data[0].map((part) => part[0]).join('') : '';
  return translated || text;
}

async function translateKeywords({ texts, source = 'en', target = 'nl' }) {
  const results = [];
  for (const text of texts) {
    const translated = await translateSingle(text, source, target);
    results.push({ text, translated });
  }
  return results;
}

module.exports = {
  listEntries,
  upsertEntry,
  listLocales,
  extractKeywords,
  translateKeywords,
};
