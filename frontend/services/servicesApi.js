const axios = require('axios');
const config = require('../config');

function normalizeBaseUrl(value) {
  return (value || 'http://localhost:3000').replace(/\/$/, '');
}

function buildApiPath(pathPart = '') {
  const base = normalizeBaseUrl(config.apiBaseUrl);
  if (base.endsWith('/api/v1')) {
    return `${base}/user/services${pathPart}`;
  }
  return `${base}/api/v1/user/services${pathPart}`;
}

async function request(pathPart) {
  const response = await axios({
    url: buildApiPath(pathPart),
    method: 'get',
    validateStatus: () => true,
  });

  const payload = response.data || {};
  if (response.status >= 400 || payload.success === false) {
    const error = new Error(payload?.error?.message || 'Failed to fetch services.');
    error.statusCode = response.status;
    throw error;
  }

  return payload.data;
}

function listServices() {
  return request('');
}

function getServiceBySlug(slug) {
  return request(`/${encodeURIComponent(slug)}`);
}

module.exports = {
  listServices,
  getServiceBySlug,
};
