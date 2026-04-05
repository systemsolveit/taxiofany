const axios = require('axios');
const config = require('../config');

const CACHE_TTL_MS = 30000;
let cacheValue = null;
let cacheAt = 0;

function normalizeBaseUrl(value) {
  return (value || 'http://localhost:3000').replace(/\/$/, '');
}

function buildApiPath(pathPart = '') {
  const base = normalizeBaseUrl(config.apiBaseUrl);
  if (base.endsWith('/api/v1')) {
    return `${base}/user/settings${pathPart}`;
  }
  return `${base}/api/v1/user/settings${pathPart}`;
}

async function fetchSiteSettings() {
  const response = await axios({
    url: buildApiPath('/site'),
    method: 'get',
    validateStatus: () => true,
  });

  const payload = response.data || {};
  if (response.status >= 400 || payload.success === false) {
    throw new Error(payload?.error?.message || 'Public settings API request failed.');
  }

  return payload.data || {};
}

async function getPublicSiteSettings(options = {}) {
  const now = Date.now();
  if (!options.force && cacheValue && now - cacheAt < CACHE_TTL_MS) {
    return cacheValue;
  }

  const data = await fetchSiteSettings();
  cacheValue = data;
  cacheAt = now;
  return data;
}

function clearPublicSiteSettingsCache() {
  cacheValue = null;
  cacheAt = 0;
}

module.exports = {
  getPublicSiteSettings,
  clearPublicSiteSettingsCache,
};
