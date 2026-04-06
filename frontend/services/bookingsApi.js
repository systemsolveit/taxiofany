const axios = require('axios');
const config = require('../config');

function normalizeBaseUrl(value) {
  return (value || 'http://localhost:3000').replace(/\/$/, '');
}

function buildApiPath(pathPart = '') {
  const base = normalizeBaseUrl(config.apiBaseUrl);
  if (base.endsWith('/api/v1')) {
    return `${base}/user/bookings${pathPart}`;
  }
  return `${base}/api/v1/user/bookings${pathPart}`;
}

async function request(pathPart, options = {}) {
  const response = await axios({
    url: buildApiPath(pathPart),
    method: options.method || 'get',
    data: options.body,
    headers: options.headers || {},
    validateStatus: () => true,
  });

  const payload = response.data || {};
  if (response.status >= 400 || payload.success === false) {
    const error = new Error(payload?.error?.message || 'Booking request failed.');
    error.statusCode = response.status;
    throw error;
  }

  return payload.data;
}

function createBooking(body) {
  return request('', {
    method: 'post',
    body,
    headers: { 'Content-Type': 'application/json' },
  });
}

function getBooking(id) {
  return request(`/${encodeURIComponent(id)}`);
}

function listMyBookings(token) {
  return request('/mine', {
    method: 'get',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

module.exports = {
  createBooking,
  getBooking,
  listMyBookings,
};