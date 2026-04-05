const axios = require('axios');
const config = require('../config');

function normalizeBaseUrl(value) {
  return (value || 'http://localhost:3000').replace(/\/$/, '');
}

function buildApiPath(pathPart = '') {
  const base = normalizeBaseUrl(config.apiBaseUrl);
  if (base.endsWith('/api/v1')) {
    return `${base}/admin/settings${pathPart}`;
  }
  return `${base}/api/v1/admin/settings${pathPart}`;
}

async function request(pathPart, token, options = {}) {
  const response = await axios({
    url: buildApiPath(pathPart),
    method: options.method || 'get',
    data: options.body,
    headers: {
      Authorization: `Bearer ${token}`,
      ...(options.headers || {}),
    },
    validateStatus: () => true,
  });

  const payload = response.data || {};
  if (response.status >= 400 || payload.success === false) {
    const error = new Error(payload?.error?.message || 'Settings API request failed.');
    error.statusCode = response.status;
    throw error;
  }

  return payload.data;
}

function getMailSettings(token) {
  return request('/mail', token);
}

function updateMailSettings(token, body) {
  return request('/mail', token, {
    method: 'patch',
    body,
    headers: { 'Content-Type': 'application/json' },
  });
}

function testMailSettings(token, body) {
  return request('/mail/test', token, {
    method: 'post',
    body,
    headers: { 'Content-Type': 'application/json' },
  });
}

function getSiteSettings(token) {
  return request('/site', token);
}

function updateSiteSettings(token, body) {
  return request('/site', token, {
    method: 'patch',
    body,
    headers: { 'Content-Type': 'application/json' },
  });
}

module.exports = {
  getMailSettings,
  updateMailSettings,
  testMailSettings,
  getSiteSettings,
  updateSiteSettings,
};
