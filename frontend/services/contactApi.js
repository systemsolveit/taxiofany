const axios = require('axios');
const config = require('../config');

function normalizeBaseUrl(value) {
  return (value || 'http://localhost:3000').replace(/\/$/, '');
}

function buildApiPath(pathPart = '') {
  const base = normalizeBaseUrl(config.apiBaseUrl);
  if (base.endsWith('/api/v1')) {
    return `${base}/user/contact${pathPart}`;
  }
  return `${base}/api/v1/user/contact${pathPart}`;
}

async function createSubmission(body) {
  const response = await axios({
    url: buildApiPath('/submissions'),
    method: 'post',
    data: body,
    headers: { 'Content-Type': 'application/json' },
    validateStatus: () => true,
  });

  const payload = response.data || {};
  if (response.status >= 400 || payload.success === false) {
    const error = new Error(payload?.error?.message || 'Contact submission failed.');
    error.statusCode = response.status;
    throw error;
  }

  return payload;
}

module.exports = {
  createSubmission,
};
