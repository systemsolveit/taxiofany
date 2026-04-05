const http = require('http');

function requestRaw(url, options = {}) {
  return new Promise((resolve, reject) => {
    const parsed = new URL(url);
    const req = http.request(
      {
        method: options.method || 'GET',
        hostname: parsed.hostname,
        port: parsed.port,
        path: `${parsed.pathname}${parsed.search}`,
        headers: options.headers || {},
      },
      (res) => {
        let data = '';
        res.on('data', (chunk) => { data += chunk; });
        res.on('end', () => resolve({ statusCode: res.statusCode, body: data }));
      }
    );

    req.on('error', reject);
    if (options.body) {
      req.write(options.body);
    }
    req.end();
  });
}

function requestJson(url, options = {}) {
  return requestRaw(url, options).then((result) => {
    let parsed = null;
    if (result.body) {
      try {
        parsed = JSON.parse(result.body);
      } catch (error) {
        throw new Error(`Invalid JSON from ${url}: ${error.message}`);
      }
    }
    return { ...result, json: parsed };
  });
}

async function firstReachable(candidates = []) {
  for (const candidate of candidates) {
    try {
      const result = await requestRaw(candidate);
      if (result.statusCode >= 200 && result.statusCode < 500) {
        return candidate;
      }
    } catch (error) {
      // try next
    }
  }

  throw new Error(`No reachable URL from candidates: ${candidates.join(', ')}`);
}

async function run() {
  const backend = process.env.SMOKE_BACKEND_URL || await firstReachable([
    'http://localhost:3000/health',
    'http://backend:3000/health',
  ]).then((url) => url.replace('/health', ''));

  const frontend = process.env.SMOKE_FRONTEND_URL || await firstReachable([
    'http://localhost:3001/book-taxi',
    'http://frontend:3001/book-taxi',
  ]).then((url) => url.replace('/book-taxi', ''));

  const createResult = await requestJson(`${backend}/api/v1/user/bookings`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      customerName: 'Smoke Booking',
      customerEmail: `smoke.booking.${Date.now()}@example.com`,
      packageType: 'standard',
      passengers: 2,
      pickupLocation: 'Airport',
      destinationLocation: 'Downtown',
      rideDate: new Date().toISOString(),
      requestedDateText: '04/05/2026',
      rideTime: '10:30',
      status: 'pending',
    }),
  });

  if (createResult.statusCode !== 201 || !createResult.json || !createResult.json.success || !createResult.json.data || !createResult.json.data._id) {
    throw new Error('Public booking create API failed.');
  }

  const bookingId = createResult.json.data._id;
  const bookingCode = createResult.json.data.bookingCode;

  const detailsResult = await requestJson(`${backend}/api/v1/user/bookings/${encodeURIComponent(bookingId)}`);
  if (detailsResult.statusCode !== 200 || !detailsResult.json || !detailsResult.json.success) {
    throw new Error('Public booking details API failed.');
  }

  const email = process.env.SMOKE_ADMIN_EMAIL || process.env.SUPER_ADMIN_EMAIL || '';
  const password = process.env.SMOKE_ADMIN_PASSWORD || process.env.SUPER_ADMIN_PASSWORD || '';
  if (!email || !password) {
    console.log('Bookings smoke test passed (public booking API only; admin checks skipped due missing credentials).');
    console.log(`Booking created: ${bookingCode}`);
    console.log(`Frontend base: ${frontend}`);
    return;
  }

  const loginResult = await requestJson(`${backend}/api/v1/admin/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  if (loginResult.statusCode !== 200 || !loginResult.json || !loginResult.json.success || !loginResult.json.data || !loginResult.json.data.token) {
    throw new Error('Admin login failed in bookings smoke test.');
  }

  const token = loginResult.json.data.token;

  const adminList = await requestJson(`${backend}/api/v1/admin/bookings`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (adminList.statusCode !== 200 || !adminList.json || !adminList.json.success || !Array.isArray(adminList.json.data)) {
    throw new Error('Admin bookings list API failed.');
  }

  const createdInAdmin = adminList.json.data.find((item) => item._id === bookingId);
  if (!createdInAdmin) {
    throw new Error('Created booking was not visible in admin bookings list.');
  }

  const updateResult = await requestJson(`${backend}/api/v1/admin/bookings/${encodeURIComponent(bookingId)}`, {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ status: 'confirmed', fareAmount: 320 }),
  });
  if (updateResult.statusCode !== 200 || !updateResult.json || !updateResult.json.success) {
    throw new Error('Admin booking update API failed.');
  }

  const dashboardPage = await requestRaw(`${frontend}/admin/bookings`);
  if (![200, 301, 302].includes(dashboardPage.statusCode)) {
    throw new Error('Frontend admin bookings page check failed.');
  }

  console.log('Bookings smoke test passed.');
  console.log(`Booking created: ${bookingCode}`);
  console.log(`Admin list count: ${adminList.json.data.length}`);
  console.log(`Frontend base: ${frontend}`);
}

run().catch((error) => {
  console.error('Bookings smoke test failed:', error.message);
  process.exitCode = 1;
});