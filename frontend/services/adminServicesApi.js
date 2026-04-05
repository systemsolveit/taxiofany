const axios = require('axios');
const config = require('../config');

function normalizeBaseUrl(value) {
  return (value || 'http://localhost:3000').replace(/\/$/, '');
}

function buildApiPath(pathPart = '') {
  const base = normalizeBaseUrl(config.apiBaseUrl);
  if (base.endsWith('/api/v1')) {
    return `${base}/admin/services${pathPart}`;
  }
  return `${base}/api/v1/admin/services${pathPart}`;
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
    const error = new Error(payload?.error?.message || 'Services API request failed.');
    error.statusCode = response.status;
    throw error;
  }

  return payload.data;
}

function listServices(token) {
  return request('', token);
}

function getService(token, id) {
  return request(`/${encodeURIComponent(id)}`, token);
}

function createService(token, body) {
  return request('', token, {
    method: 'post',
    body,
    headers: { 'Content-Type': 'application/json' },
  });
}

function updateService(token, id, body) {
  return request(`/${encodeURIComponent(id)}`, token, {
    method: 'patch',
    body,
    headers: { 'Content-Type': 'application/json' },
  });
}

function deleteService(token, id) {
  return request(`/${encodeURIComponent(id)}`, token, {
    method: 'delete',
  });
}

module.exports = {
  listServices,
  getService,
  createService,
  updateService,
  deleteService,
};
