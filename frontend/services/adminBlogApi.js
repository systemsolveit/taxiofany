const axios = require('axios');
const config = require('../config');

function normalizeBaseUrl(value) {
  return (value || 'http://localhost:3000').replace(/\/$/, '');
}

function buildApiPath(pathPart = '') {
  const base = normalizeBaseUrl(config.apiBaseUrl);
  if (base.endsWith('/api/v1')) {
    return `${base}/admin/blog${pathPart}`;
  }

  return `${base}/api/v1/admin/blog${pathPart}`;
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
    const error = new Error(payload?.error?.message || 'Blog API request failed.');
    error.statusCode = response.status;
    throw error;
  }

  return payload.data;
}

function listPosts(token) {
  return request('', token);
}

function getPost(token, id) {
  return request(`/${encodeURIComponent(id)}`, token);
}

function createPost(token, body) {
  return request('', token, {
    method: 'post',
    body,
    headers: { 'Content-Type': 'application/json' },
  });
}

function updatePost(token, id, body) {
  return request(`/${encodeURIComponent(id)}`, token, {
    method: 'patch',
    body,
    headers: { 'Content-Type': 'application/json' },
  });
}

function deletePost(token, id) {
  return request(`/${encodeURIComponent(id)}`, token, {
    method: 'delete',
  });
}

module.exports = {
  listPosts,
  getPost,
  createPost,
  updatePost,
  deletePost,
};