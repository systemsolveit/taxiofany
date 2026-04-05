const axios = require('axios');
const config = require('../config');

function normalizeBaseUrl(value) {
  return (value || 'http://localhost:3000').replace(/\/$/, '');
}

function buildApiPath(pathPart = '') {
  const base = normalizeBaseUrl(config.apiBaseUrl);
  if (base.endsWith('/api/v1')) {
    return `${base}/user/emails${pathPart}`;
  }
  return `${base}/api/v1/user/emails${pathPart}`;
}

async function request(pathPart = '') {
  const response = await axios({
    url: buildApiPath(pathPart),
    method: 'get',
    validateStatus: () => true,
  });

  const payload = response.data || {};
  if (response.status >= 400 || payload.success === false) {
    const error = new Error(payload?.error?.message || 'Failed to fetch email templates.');
    error.statusCode = response.status;
    throw error;
  }

  return payload.data;
}

function listTemplates() {
  return request('');
}

function getTemplateBySlug(slug) {
  return request(`/${encodeURIComponent(slug)}`);
}

module.exports = {
  listTemplates,
  getTemplateBySlug,
};
