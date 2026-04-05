const axios = require('axios');
const config = require('../config');

function normalizeBaseUrl(value) {
  return (value || 'http://localhost:3000').replace(/\/$/, '');
}

function buildApiPath(pathPart = '') {
  const base = normalizeBaseUrl(config.apiBaseUrl);
  if (base.endsWith('/api/v1')) {
    return `${base}/admin/bookings${pathPart}`;
  }
  return `${base}/api/v1/admin/bookings${pathPart}`;
}

async function request(pathPart, token, options = {}) {
  const response = await axios({
    url: buildApiPath(pathPart),
    method: options.method || 'get',
    data: options.body,
    headers: {
      Authorization: `Bearer ${token}`,
      ...(options.headers || {}),
    },
    validateStatus: () => true,
  });

  const payload = response.data || {};
  if (response.status >= 400 || payload.success === false) {
    const error = new Error(payload?.error?.message || 'Bookings API request failed.');
    error.statusCode = response.status;
    throw error;
  }

  return payload.data;
}

function listBookings(token) {
  return request('', token);
}

function getBooking(token, id) {
  return request(`/${encodeURIComponent(id)}`, token);
}

function updateBooking(token, id, body) {
  return request(`/${encodeURIComponent(id)}`, token, {
    method: 'patch',
    body,
    headers: { 'Content-Type': 'application/json' },
  });
}

module.exports = {
  listBookings,
  getBooking,
  updateBooking,
};