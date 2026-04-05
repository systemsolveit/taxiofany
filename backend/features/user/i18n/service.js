const fs = require('fs');
const path = require('path');
const { Translation, Locale } = require('../../../models');

const localeCodePattern = /^[a-z]{2,10}(?:-[a-z0-9]{2,8})?$/i;
const DEFAULT_FALLBACK_LOCALE = 'nl';
const TEMPLATE_FALLBACK_CACHE_TTL_MS = 60 * 1000;

const templateFallbackCache = {
  expiresAt: 0,
  value: {},
};

function normalizeLocaleCode(locale) {
  return String(locale || '').trim().toLowerCase();
}

function assertValidLocaleCode(locale) {
  const code = normalizeLocaleCode(locale);
  if (!localeCodePattern.test(code)) {
    const error = new Error('Locale code format is invalid. Use values like en, nl, fr, or ar-eg.');
    error.statusCode = 400;
    error.code = 'INVALID_LOCALE';
    throw error;
  }

  return code;
}

function createLocaleLabel(code) {
  return String(code || '')
    .split('-')
    .filter(Boolean)
    .map((part) => part.toUpperCase())
    .join(' ');
}

function setByPath(target, keyPath, value) {
  const parts = keyPath.split('.');
  let cursor = target;
  for (let index = 0; index < parts.length - 1; index += 1) {
    const part = parts[index];
    if (!cursor[part] || typeof cursor[part] !== 'object') {
      cursor[part] = {};
    }
    cursor = cursor[part];
  }
  cursor[parts[parts.length - 1]] = value;
}

function flattenObject(obj, prefix = '', acc = {}) {
  Object.keys(obj || {}).forEach((key) => {
    const value = obj[key];
    const fullKey = prefix ? `${prefix}.${key}` : key;
    if (value && typeof value === 'object' && !Array.isArray(value)) {
      flattenObject(value, fullKey, acc);
    } else {
      acc[fullKey] = value;
    }
  });
  return acc;
}

function resolveViewsRoots() {
  const candidates = [
    process.env.I18N_VIEWS_DIR,
    process.env.I18N_USERS_VIEWS_DIR,
    '/frontend/views',
    path.resolve(__dirname, '../../../../../frontend/views'),
  ].filter(Boolean);

  return candidates.filter((candidate) => fs.existsSync(candidate));
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

function decodeJsQuoted(value) {
  return String(value || '')
    .replace(/\\'/g, "'")
    .replace(/\\"/g, '"')
    .replace(/\\n/g, '\n')
    .replace(/\\r/g, '\r')
    .replace(/\\t/g, '\t')
    .replace(/\\\\/g, '\\');
}

function readTemplateFallbackEntries() {
  const now = Date.now();
  if (templateFallbackCache.expiresAt > now) {
    return templateFallbackCache.value;
  }

  const roots = resolveViewsRoots();
  const fallbackMap = {};
  const singleQuotePattern = /t\(\s*'([^']+)'\s*,\s*'((?:\\'|[^'])*)'\s*\)/g;
  const doubleQuotePattern = /t\(\s*"([^"]+)"\s*,\s*"((?:\\"|[^"])*)"\s*\)/g;

  roots.forEach((root) => {
    collectEjsFiles(root).forEach((filePath) => {
      try {
        const content = fs.readFileSync(filePath, 'utf8');
        [singleQuotePattern, doubleQuotePattern].forEach((pattern) => {
          pattern.lastIndex = 0;
          let match = pattern.exec(content);
          while (match) {
            const key = String(match[1] || '').trim();
            const fallback = decodeJsQuoted(match[2] || '').trim();
            if (key && fallback && !Object.prototype.hasOwnProperty.call(fallbackMap, key)) {
              fallbackMap[key] = fallback;
            }
            match = pattern.exec(content);
          }
        });
      } catch (error) {
        // Ignore individual template read failures and continue.
      }
    });
  });

  templateFallbackCache.value = fallbackMap;
  templateFallbackCache.expiresAt = now + TEMPLATE_FALLBACK_CACHE_TTL_MS;
  return fallbackMap;
}

function mergeMissingTemplateFallbacks(dictionary) {
  const merged = dictionary && typeof dictionary === 'object' ? { ...dictionary } : {};
  const fallbackEntries = readTemplateFallbackEntries();
  const flattened = flattenObject(merged);

  Object.keys(fallbackEntries).forEach((key) => {
    if (flattened[key] === undefined) {
      setByPath(merged, key, fallbackEntries[key]);
    }
  });

  return merged;
}

async function listLocaleRegistry() {
  const storedLocales = await Locale.find({}).lean().sort({ code: 1 });

  return storedLocales
    .map((locale) => {
      const code = normalizeLocaleCode(locale.code);
      return {
        code,
        label: locale.label || createLocaleLabel(code),
        baseLocale: normalizeLocaleCode(locale.baseLocale),
        isActive: typeof locale.isActive === 'boolean' ? locale.isActive : true,
        hasDefaultFile: false,
        isDefault: !normalizeLocaleCode(locale.baseLocale),
        source: 'database',
      };
    })
    .sort((left, right) => left.code.localeCompare(right.code));
}

async function listSupportedLocales() {
  const locales = await listLocaleRegistry();
  return locales.filter((locale) => locale.isActive).map((locale) => locale.code);
}

async function isSupportedLocale(locale) {
  const code = normalizeLocaleCode(locale);
  if (!code) {
    return false;
  }

  const locales = await listLocaleRegistry();
  return locales.some((item) => item.code === code && item.isActive);
}

async function resolveFallbackLocale() {
  const locales = await listSupportedLocales();
  if (!locales.length) {
    return DEFAULT_FALLBACK_LOCALE;
  }

  if (locales.includes(DEFAULT_FALLBACK_LOCALE)) {
    return DEFAULT_FALLBACK_LOCALE;
  }

  return locales[0];
}

async function resolveLocale(locale) {
  const code = normalizeLocaleCode(locale);
  if (code && (await isSupportedLocale(code))) {
    return code;
  }
  return resolveFallbackLocale();
}

async function ensureLocaleRegistration(locale, options = {}) {
  const code = assertValidLocaleCode(locale);
  const existing = await Locale.findOne({ code }).lean();
  if (existing) {
    return existing;
  }

  const baseLocale = normalizeLocaleCode(options.baseLocale);
  const created = await Locale.create({
    code,
    label: String(options.label || createLocaleLabel(code)).trim(),
    baseLocale: baseLocale && baseLocale !== code ? baseLocale : null,
    isActive: options.isActive !== false,
    updatedBy: options.updatedBy,
  });

  return created.toObject();
}

async function getBaseDictionary(locale, registryMap, visited = new Set()) {
  const code = normalizeLocaleCode(locale);
  if (!code) {
    return {};
  }

  if (visited.has(code)) {
    return {};
  }

  visited.add(code);

  const localeRecord = registryMap.get(code);
  const nextBase = normalizeLocaleCode(localeRecord && localeRecord.baseLocale);
  const base = nextBase && nextBase !== code ? await getBaseDictionary(nextBase, registryMap, visited) : {};

  const entries = await Translation.find({ locale: code }).lean();
  entries.forEach((entry) => {
    setByPath(base, entry.key, entry.value);
  });

  return base;
}

async function getDictionary(locale) {
  const safeLocale = await resolveLocale(locale);
  const localeRegistry = await listLocaleRegistry();
  const registryMap = new Map(localeRegistry.map((item) => [item.code, item]));
  const base = await getBaseDictionary(safeLocale, registryMap);
  const dictionary = mergeMissingTemplateFallbacks(base);

  return {
    locale: safeLocale,
    dictionary,
  };
}

async function listEntries(locale) {
  const safeLocale = await resolveLocale(locale);
  const localeRegistry = await listLocaleRegistry();
  const registryMap = new Map(localeRegistry.map((item) => [item.code, item]));
  const base = flattenObject(await getBaseDictionary(safeLocale, registryMap));
  const overrides = await Translation.find({ locale: safeLocale }).lean();
  const overrideKeys = new Set(overrides.map((entry) => entry.key));

  const records = { ...base };

  return Object.keys(records)
    .sort()
    .map((key) => ({
      key,
      value: records[key],
      source: overrideKeys.has(key) ? 'db' : 'inherited',
    }));
}

async function upsertEntry({ locale, key, value, updatedBy }) {
  const safeLocale = assertValidLocaleCode(locale);
  const cleanKey = String(key || '').trim();
  const cleanValue = String(value || '');

  if (!cleanKey) {
    const error = new Error('Translation key is required.');
    error.statusCode = 400;
    error.code = 'VALIDATION_ERROR';
    throw error;
  }

  await ensureLocaleRegistration(safeLocale, { updatedBy });

  const doc = await Translation.findOneAndUpdate(
    { locale: safeLocale, key: cleanKey },
    {
      $set: {
        value: cleanValue,
        updatedBy,
      },
    },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  ).lean();

  return {
    locale: doc.locale,
    key: doc.key,
    value: doc.value,
    updatedAt: doc.updatedAt,
  };
}

async function bulkUpsertEntries({ locale, entries, updatedBy }) {
  const safeLocale = assertValidLocaleCode(locale);
  const normalizedEntries = Array.isArray(entries)
    ? entries
        .map((entry) => ({
          key: String(entry && entry.key ? entry.key : '').trim(),
          value: String(entry && Object.prototype.hasOwnProperty.call(entry, 'value') ? entry.value : ''),
        }))
        .filter((entry) => entry.key)
    : [];

  if (!normalizedEntries.length) {
    const error = new Error('At least one valid translation entry is required.');
    error.statusCode = 400;
    error.code = 'VALIDATION_ERROR';
    throw error;
  }

  await ensureLocaleRegistration(safeLocale, { updatedBy });

  const operations = normalizedEntries.map((entry) => ({
    updateOne: {
      filter: { locale: safeLocale, key: entry.key },
      update: {
        $set: {
          value: entry.value,
          updatedBy,
        },
      },
      upsert: true,
    },
  }));

  await Translation.bulkWrite(operations, { ordered: false });

  const saved = await Translation.find({
    locale: safeLocale,
    key: { $in: normalizedEntries.map((entry) => entry.key) },
  })
    .lean()
    .sort({ key: 1 });

  return saved.map((doc) => ({
    locale: doc.locale,
    key: doc.key,
    value: doc.value,
    updatedAt: doc.updatedAt,
  }));
}

async function createLocale({ code, label, baseLocale, isActive = true, updatedBy }) {
  const safeCode = assertValidLocaleCode(code);
  const safeBaseLocale = normalizeLocaleCode(baseLocale);

  if (safeBaseLocale && safeBaseLocale !== safeCode && !(await isSupportedLocale(safeBaseLocale))) {
    const error = new Error('Base locale must already exist before creating a new locale.');
    error.statusCode = 400;
    error.code = 'INVALID_BASE_LOCALE';
    throw error;
  }

  let computedBaseLocale = safeBaseLocale;
  if (!computedBaseLocale) {
    const fallback = await resolveFallbackLocale();
    computedBaseLocale = fallback !== safeCode ? fallback : null;
  }

  await Locale.findOneAndUpdate(
    { code: safeCode },
    {
      $set: {
        label: String(label || createLocaleLabel(safeCode)).trim(),
        baseLocale: computedBaseLocale,
        isActive,
        updatedBy,
      },
    },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );

  const locales = await listLocaleRegistry();
  return locales.find((localeItem) => localeItem.code === safeCode);
}

async function updateLocale(code, { label, baseLocale, isActive, updatedBy }) {
  const safeCode = assertValidLocaleCode(code);
  const existing = await listLocaleRegistry();
  const current = existing.find((item) => item.code === safeCode);

  if (!current) {
    const error = new Error('Locale not found.');
    error.statusCode = 404;
    error.code = 'LOCALE_NOT_FOUND';
    throw error;
  }

  const fallback = await resolveFallbackLocale();
  const nextBaseLocale = normalizeLocaleCode(baseLocale || current.baseLocale || fallback);
  if (nextBaseLocale !== safeCode && !existing.some((item) => item.code === nextBaseLocale && item.isActive)) {
    const error = new Error('Base locale must reference an active locale.');
    error.statusCode = 400;
    error.code = 'INVALID_BASE_LOCALE';
    throw error;
  }

  await Locale.findOneAndUpdate(
    { code: safeCode },
    {
      $set: {
        label: String(label || current.label || createLocaleLabel(safeCode)).trim(),
        baseLocale: nextBaseLocale && nextBaseLocale !== safeCode ? nextBaseLocale : null,
        isActive: typeof isActive === 'boolean' ? isActive : current.isActive,
        updatedBy,
      },
    },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );

  const locales = await listLocaleRegistry();
  return locales.find((localeItem) => localeItem.code === safeCode);
}

module.exports = {
  getDictionary,
  listEntries,
  upsertEntry,
  bulkUpsertEntries,
  createLocale,
  updateLocale,
  listLocaleRegistry,
  isSupportedLocale,
  listSupportedLocales,
};
