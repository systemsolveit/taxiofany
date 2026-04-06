const axios = require('axios');
const config = require('../config');

function normalizeBaseUrl(value) {
  return (value || 'http://localhost:3000').replace(/\/$/, '');
}

function buildApiPath(pathPart = '') {
  const base = normalizeBaseUrl(config.apiBaseUrl);
  if (base.endsWith('/api/v1')) {
    return `${base}/admin/database${pathPart}`;
  }
  return `${base}/api/v1/admin/database${pathPart}`;
}

async function request(pathPart, token, options = {}) {
  const response = await axios({
    url: buildApiPath(pathPart),
    method: options.method || 'get',
    data: options.body,
    params: options.params,
    headers: {
      Authorization: `Bearer ${token}`,
      ...(options.headers || {}),
    },
    validateStatus: () => true,
  });

  const payload = response.data || {};
  if (response.status >= 400 || payload.success === false) {
    const error = new Error(payload?.error?.message || 'Database API request failed.');
    error.statusCode = response.status;
    throw error;
  }

  return payload.data;
}

function exportDatabase(token) {
  return request('/export', token);
}

function importDatabase(token, body, dryRun = false) {
  return request('/import', token, {
    method: 'post',
    body,
    params: dryRun ? { dryRun: '1' } : {},
    headers: { 'Content-Type': 'application/json' },
  });
}

function resetContent(token, body) {
  return request('/reset-content', token, {
    method: 'post',
    body,
    headers: { 'Content-Type': 'application/json' },
  });
}

function seedDemo(token) {
  return request('/seed-demo', token, {
    method: 'post',
  });
}

module.exports = {
  exportDatabase,
  importDatabase,
  resetContent,
  seedDemo,
};
