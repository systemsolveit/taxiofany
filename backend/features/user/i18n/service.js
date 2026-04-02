const { Translation } = require('../../../models');
const defaultEn = require('./defaults/en');
const defaultNl = require('./defaults/nl');

const FALLBACK_LOCALE = 'nl';
const defaultsByLocale = {
  en: defaultEn,
  nl: defaultNl,
};

function clone(obj) {
  return JSON.parse(JSON.stringify(obj));
}

function setByPath(target, path, value) {
  const parts = path.split('.');
  let cursor = target;
  for (let i = 0; i < parts.length - 1; i += 1) {
    const part = parts[i];
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

function resolveLocale(locale) {
  const normalized = String(locale || '').toLowerCase();
  if (defaultsByLocale[normalized]) {
    return normalized;
  }
  return FALLBACK_LOCALE;
}

async function getDictionary(locale) {
  const safeLocale = resolveLocale(locale);
  const base = clone(defaultsByLocale[safeLocale]);

  const overrides = await Translation.find({ locale: safeLocale }).lean();
  overrides.forEach((entry) => {
    setByPath(base, entry.key, entry.value);
  });

  return {
    locale: safeLocale,
    dictionary: base,
  };
}

async function listEntries(locale) {
  const safeLocale = resolveLocale(locale);
  const base = flattenObject(defaultsByLocale[safeLocale]);
  const overrides = await Translation.find({ locale: safeLocale }).lean();

  const records = { ...base };
  overrides.forEach((entry) => {
    records[entry.key] = entry.value;
  });

  return Object.keys(records)
    .sort()
    .map((key) => ({
      key,
      value: records[key],
      source: overrides.some((entry) => entry.key === key) ? 'db' : 'default',
    }));
}

async function upsertEntry({ locale, key, value, updatedBy }) {
  const safeLocale = resolveLocale(locale);
  const cleanKey = String(key || '').trim();
  const cleanValue = String(value || '');

  if (!cleanKey) {
    const error = new Error('Translation key is required.');
    error.statusCode = 400;
    error.code = 'VALIDATION_ERROR';
    throw error;
  }

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

function listSupportedLocales() {
  return Object.keys(defaultsByLocale);
}

module.exports = {
  getDictionary,
  listEntries,
  upsertEntry,
  listSupportedLocales,
};
