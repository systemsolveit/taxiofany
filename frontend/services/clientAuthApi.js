const config = require('../config');

function normalizeApiBaseUrl(value) {
  if (!value) {
    return 'http://localhost:3000';
  }
  return value.replace(/\/$/, '');
}

function buildClientUrl(pathPart) {
  const base = normalizeApiBaseUrl(config.apiBaseUrl);
  if (base.endsWith('/api/v1')) {
    return `${base}/user/auth/${pathPart}`;
  }
  return `${base}/api/v1/user/auth/${pathPart}`;
}

async function request(pathPart, payload) {
  const response = await fetch(buildClientUrl(pathPart), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  const result = await response.json().catch(() => ({}));
  if (!response.ok || !result.success) {
    const error = new Error(result?.error?.message || 'Request failed.');
    error.statusCode = response.status || 400;
    throw error;
  }

  return result.data;
}

async function registerClient(payload) {
  return request('register', payload);
}

async function loginClient(payload) {
  return request('login', payload);
}

module.exports = {
  registerClient,
  loginClient,
};
