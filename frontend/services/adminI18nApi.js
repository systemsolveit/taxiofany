const config = require('../config');

function normalizeBaseUrl(value) {
  return (value || 'http://localhost:3000').replace(/\/$/, '');
}

function buildPath(pathPart) {
  const base = normalizeBaseUrl(config.apiBaseUrl);
  if (base.endsWith('/api/v1')) {
    return `${base}/admin/i18n/${pathPart}`;
  }
  return `${base}/api/v1/admin/i18n/${pathPart}`;
}

async function request(pathPart, token, options = {}) {
  const response = await fetch(buildPath(pathPart), {
    method: options.method || 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  const payload = await response.json().catch(() => ({}));
  if (!response.ok || !payload.success) {
    const error = new Error(payload?.error?.message || 'i18n API request failed.');
    error.statusCode = response.status;
    throw error;
  }

  return payload.data;
}

async function listLocales(token) {
  return request('locales', token);
}

async function listEntries(token, locale) {
  return request(`entries?locale=${encodeURIComponent(locale)}`, token);
}

async function saveEntry(token, body) {
  return request('entries', token, { method: 'POST', body });
}

async function extractKeywords(token, limit = 120) {
  return request(`extract-keywords?limit=${encodeURIComponent(limit)}`, token);
}

async function translateKeywords(token, body) {
  return request('translate-keywords', token, { method: 'POST', body });
}

module.exports = {
  listLocales,
  listEntries,
  saveEntry,
  extractKeywords,
  translateKeywords,
};
