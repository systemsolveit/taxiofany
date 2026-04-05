const axios = require('axios');
const config = require('../config');

function normalizeBaseUrl(value) {
  return (value || 'http://localhost:3000').replace(/\/$/, '');
}

function buildApiPath(pathPart = '') {
  const base = normalizeBaseUrl(config.apiBaseUrl);
  if (base.endsWith('/api/v1')) {
    return `${base}/user/blog${pathPart}`;
  }

  return `${base}/api/v1/user/blog${pathPart}`;
}

async function listPosts(params = {}) {
  const response = await axios({
    url: buildApiPath(''),
    method: 'get',
    params,
    validateStatus: () => true,
  });

  const payload = response.data || {};
  if (response.status >= 400 || payload.success === false) {
    const error = new Error(payload?.error?.message || 'Failed to fetch blog posts.');
    error.statusCode = response.status;
    throw error;
  }

  return payload.data;
}

async function getPostBySlug(slug) {
  const response = await axios({
    url: buildApiPath(`/${encodeURIComponent(slug)}`),
    method: 'get',
    validateStatus: () => true,
  });

  const payload = response.data || {};
  if (response.status >= 400 || payload.success === false) {
    const error = new Error(payload?.error?.message || 'Failed to fetch blog post.');
    error.statusCode = response.status;
    throw error;
  }

  return payload.data;
}

async function submitComment(slug, payload = {}) {
  const response = await axios({
    url: buildApiPath(`/${encodeURIComponent(slug)}/comments`),
    method: 'post',
    data: payload,
    validateStatus: () => true,
  });

  const result = response.data || {};
  if (response.status >= 400 || result.success === false) {
    const error = new Error(result?.error?.message || 'Failed to submit comment.');
    error.statusCode = response.status;
    throw error;
  }

  return result.data;
}

module.exports = {
  listPosts,
  getPostBySlug,
  submitComment,
};