const axios = require('axios');
const config = require('../config');

function normalizeBaseUrl(value) {
  return (value || 'http://localhost:3000').replace(/\/$/, '');
}

function buildApiPath(pathPart = '') {
  const base = normalizeBaseUrl(config.apiBaseUrl);
  if (base.endsWith('/api/v1')) {
    return `${base}/user/drivers${pathPart}`;
  }
  return `${base}/api/v1/user/drivers${pathPart}`;
}

async function request(pathPart) {
  const response = await axios({
    url: buildApiPath(pathPart),
    method: 'get',
    validateStatus: () => true,
  });

  const payload = response.data || {};
  if (response.status >= 400 || payload.success === false) {
    const error = new Error(payload?.error?.message || 'Failed to fetch drivers.');
    error.statusCode = response.status;
    throw error;
  }

  return payload.data;
}

function listDrivers() {
  return request('');
}

function getDriverBySlug(slug) {
  return request(`/${encodeURIComponent(slug)}`);
}

module.exports = {
  listDrivers,
  getDriverBySlug,
};