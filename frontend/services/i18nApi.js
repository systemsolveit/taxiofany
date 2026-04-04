const config = require('../config');

const cache = new Map();
const LOCALES_CACHE_TTL_MS = 60 * 1000;

function normalizeBaseUrl(value) {
  return (value || 'http://localhost:3000').replace(/\/$/, '');
}

function buildUrl(locale) {
  const base = normalizeBaseUrl(config.apiBaseUrl);
  if (base.endsWith('/api/v1')) {
    return `${base}/user/i18n/${locale}`;
  }
  return `${base}/api/v1/user/i18n/${locale}`;
}

function buildLocalesUrl() {
  const base = normalizeBaseUrl(config.apiBaseUrl);
  if (base.endsWith('/api/v1')) {
    return `${base}/user/i18n/locales`;
  }
  return `${base}/api/v1/user/i18n/locales`;
}

async function fetchDictionary(locale) {
  const response = await fetch(buildUrl(locale));
  const payload = await response.json().catch(() => ({}));

  if (!response.ok || !payload.success || !payload.data || !payload.data.dictionary) {
    throw new Error(payload?.error?.message || 'Failed to load translations.');
  }

  return payload.data.dictionary;
}

async function fetchLocales() {
  const cacheKey = '__locales__';
  const now = Date.now();
  const cached = cache.get(cacheKey);
  if (cached && cached.expiresAt > now) {
    return cached.value;
  }

  const response = await fetch(buildLocalesUrl());
  const payload = await response.json().catch(() => ({}));

  if (!response.ok || !payload.success || !Array.isArray(payload.data)) {
    throw new Error(payload?.error?.message || 'Failed to load locales.');
  }

  const locales = payload.data
    .filter((code) => typeof code === 'string' && code.trim())
    .map((code) => code.trim().toLowerCase());

  cache.set(cacheKey, {
    value: locales,
    expiresAt: now + LOCALES_CACHE_TTL_MS,
  });

  return locales;
}

module.exports = {
  fetchDictionary,
  fetchLocales,
};
