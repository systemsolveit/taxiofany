const config = require('../config');

const cache = new Map();
const CACHE_TTL_MS = 60 * 1000;

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

async function fetchDictionary(locale) {
  const now = Date.now();
  const cached = cache.get(locale);
  if (cached && cached.expiresAt > now) {
    return cached.value;
  }

  const response = await fetch(buildUrl(locale));
  const payload = await response.json().catch(() => ({}));

  if (!response.ok || !payload.success || !payload.data || !payload.data.dictionary) {
    throw new Error(payload?.error?.message || 'Failed to load translations.');
  }

  const dictionary = payload.data.dictionary;
  cache.set(locale, {
    value: dictionary,
    expiresAt: now + CACHE_TTL_MS,
  });

  return dictionary;
}

module.exports = {
  fetchDictionary,
};
