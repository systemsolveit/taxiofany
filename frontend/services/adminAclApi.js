const axios = require('axios');
const config = require('../config');

function normalizeBaseUrl(value) {
  return (value || 'http://localhost:3000').replace(/\/$/, '');
}

function buildApiPath(pathPart = '') {
  const base = normalizeBaseUrl(config.apiBaseUrl);
  if (base.endsWith('/api/v1')) {
    return `${base}/admin/acl${pathPart}`;
  }
  return `${base}/api/v1/admin/acl${pathPart}`;
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
    const error = new Error(payload?.error?.message || 'ACL API request failed.');
    error.statusCode = response.status;
    throw error;
  }

  return payload.data;
}

function listRoles(token) {
  return request('/roles', token);
}

function listPermissions(token) {
  return request('/permissions', token);
}

function updateRolePermissions(token, role, permissions) {
  return request(`/roles/${encodeURIComponent(role)}`, token, {
    method: 'patch',
    body: { permissions },
    headers: { 'Content-Type': 'application/json' },
  });
}

function resetRolePermissions(token, role) {
  return request(`/roles/${encodeURIComponent(role)}`, token, {
    method: 'delete',
  });
}

module.exports = {
  listRoles,
  listPermissions,
  updateRolePermissions,
  resetRolePermissions,
};
