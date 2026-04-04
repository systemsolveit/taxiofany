const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const config = require('../config');

function normalizeBaseUrl(value) {
  return (value || 'http://localhost:3000').replace(/\/$/, '');
}

function getServerBaseUrl() {
  const base = normalizeBaseUrl(config.apiBaseUrl);
  return base.endsWith('/api/v1') ? base.slice(0, -7) : base;
}

function buildApiPath(pathPart = '') {
  const base = normalizeBaseUrl(config.apiBaseUrl);
  if (base.endsWith('/api/v1')) {
    return `${base}/admin/mediahub${pathPart}`;
  }

  return `${base}/api/v1/admin/mediahub${pathPart}`;
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
    const error = new Error(payload?.error?.message || 'Media Hub API request failed.');
    error.statusCode = response.status;
    throw error;
  }

  return payload.data;
}

async function listMedia(token, params = {}) {
  return request('', token, { params });
}

async function uploadMedia(token, file, body = {}) {
  const form = new FormData();
  form.append('file', fs.createReadStream(file.path), file.originalname);
  form.append('title', body.title || '');
  form.append('altText', body.altText || '');
  form.append('description', body.description || '');
  form.append('tags', body.tags || '');

  return request('', token, {
    method: 'post',
    body: form,
    headers: form.getHeaders(),
  });
}

async function updateMedia(token, filename, body = {}) {
  return request(`/${encodeURIComponent(filename)}`, token, {
    method: 'patch',
    body,
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

async function deleteMedia(token, filename) {
  return request(`/${encodeURIComponent(filename)}`, token, {
    method: 'delete',
  });
}

async function getMediaStream(filename) {
  return axios({
    url: `${getServerBaseUrl()}/mediahub/uploads/${encodeURIComponent(filename)}`,
    method: 'get',
    responseType: 'stream',
    validateStatus: () => true,
  });
}

module.exports = {
  listMedia,
  uploadMedia,
  updateMedia,
  deleteMedia,
  getMediaStream,
};