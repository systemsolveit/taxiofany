const config = require('../config');

function normalizeApiBaseUrl(value) {
  if (!value) {
    return 'http://localhost:3000';
  }
  return value.replace(/\/$/, '');
}

function buildAdminLoginUrl() {
  const base = normalizeApiBaseUrl(config.apiBaseUrl);
  if (base.endsWith('/api/v1')) {
    return `${base}/admin/auth/login`;
  }
  return `${base}/api/v1/admin/auth/login`;
}

async function loginAdmin(email, password) {
  const response = await fetch(buildAdminLoginUrl(), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });

  const payload = await response.json().catch(() => ({}));

  if (!response.ok || !payload.success) {
    const error = new Error(payload?.error?.message || 'Login failed.');
    error.statusCode = response.status || 401;
    throw error;
  }

  return payload.data;
}

module.exports = {
  loginAdmin,
};
