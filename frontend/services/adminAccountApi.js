const axios = require('axios');
const config = require('../config');

function normalizeBaseUrl(value) {
  return (value || 'http://localhost:3000').replace(/\/$/, '');
}

function buildApiPath(pathPart = '') {
  const base = normalizeBaseUrl(config.apiBaseUrl);
  if (base.endsWith('/api/v1')) {
    return `${base}/admin/auth${pathPart}`;
  }
  return `${base}/api/v1/admin/auth${pathPart}`;
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
    const error = new Error(payload?.error?.message || 'Admin account API request failed.');
    error.statusCode = response.status;
    throw error;
  }

  return payload.data;
}

function getProfile(token) {
  return request('/me', token);
}

function patchPassword(token, body) {
  return request('/me/password', token, {
    method: 'patch',
    body,
    headers: { 'Content-Type': 'application/json' },
  });
}

function getAuditLog(token, params) {
  return request('/me/audit', token, {
    method: 'get',
    params,
  });
}

module.exports = {
  getProfile,
  patchPassword,
  getAuditLog,
};
