const axios = require('axios');
const config = require('../config');
const { asArray, warnDev } = require('./apiListUtils');

function normalizeBaseUrl(value) {
  return (value || 'http://localhost:3000').replace(/\/$/, '');
}

function buildApiPath(pathPart = '') {
  const base = normalizeBaseUrl(config.apiBaseUrl);
  if (base.endsWith('/api/v1')) {
    return `${base}/user/content${pathPart}`;
  }
  return `${base}/api/v1/user/content${pathPart}`;
}

async function requestList(pathPart, params = {}) {
  try {
    const response = await axios({
      url: buildApiPath(pathPart),
      method: 'get',
      params,
      validateStatus: () => true,
    });

    const payload = response.data || {};
    if (response.status >= 400 || payload.success === false) {
      const error = new Error(payload?.error?.message || 'Failed to fetch public content.');
      error.statusCode = response.status;
      throw error;
    }

    return asArray(payload.data);
  } catch (error) {
    warnDev('publicContent', error);
    return [];
  }
}

function listTestimonials(limit = 12) {
  return requestList('/testimonials', { limit });
}

function listPackages(limit = 12) {
  return requestList('/packages', { limit });
}

module.exports = {
  listTestimonials,
  listPackages,
};
