const axios = require('axios');
const config = require('../config');

function normalizeBaseUrl(value) {
  return (value || 'http://localhost:3000').replace(/\/$/, '');
}

function buildApiPath(pathPart = '') {
  const base = normalizeBaseUrl(config.apiBaseUrl);
  if (base.endsWith('/api/v1')) {
    return `${base}/admin/contact${pathPart}`;
  }
  return `${base}/api/v1/admin/contact${pathPart}`;
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
    const error = new Error(payload?.error?.message || 'Contact API request failed.');
    error.statusCode = response.status;
    throw error;
  }

  return payload.data;
}

function listSubmissions(token) {
  return request('/submissions', token);
}

function getSubmission(token, id) {
  return request(`/submissions/${encodeURIComponent(id)}`, token);
}

function updateSubmission(token, id, body) {
  return request(`/submissions/${encodeURIComponent(id)}`, token, {
    method: 'patch',
    body,
    headers: { 'Content-Type': 'application/json' },
  });
}

module.exports = {
  listSubmissions,
  getSubmission,
  updateSubmission,
};