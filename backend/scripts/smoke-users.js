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
        res.on('end', () => resolve({ statusCode: res.statusCode, headers: res.headers, body: data }));
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
    'http://localhost:3001/admin/users',
    'http://frontend:3001/admin/users',
  ]).then((url) => url.replace('/admin/users', ''));

  const adminPage = await requestRaw(`${frontend}/admin/users`);
  if (![200, 301, 302].includes(adminPage.statusCode)) {
    throw new Error('Frontend admin users page check failed.');
  }

  const email = process.env.SMOKE_ADMIN_EMAIL || process.env.SUPER_ADMIN_EMAIL || '';
  const password = process.env.SMOKE_ADMIN_PASSWORD || process.env.SUPER_ADMIN_PASSWORD || '';

  if (!email || !password) {
    console.log('Users smoke test passed (frontend route check only; admin API check skipped due missing credentials).');
    console.log(`Frontend base: ${frontend}`);
    return;
  }

  const loginResult = await requestJson(`${backend}/api/v1/admin/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  if (loginResult.statusCode !== 200 || !loginResult.json || !loginResult.json.success || !loginResult.json.data || !loginResult.json.data.token) {
    throw new Error('Admin login failed in users smoke test.');
  }

  const token = loginResult.json.data.token;
  const usersResult = await requestJson(`${backend}/api/v1/admin/users`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (usersResult.statusCode !== 200 || !usersResult.json || !usersResult.json.success || !Array.isArray(usersResult.json.data)) {
    throw new Error('Admin users list API failed.');
  }

  if (!usersResult.json.data.length) {
    throw new Error('Admin users list returned no users.');
  }

  const firstUser = usersResult.json.data[0];
  const userId = firstUser._id;

  const detailsResult = await requestJson(`${backend}/api/v1/admin/users/${encodeURIComponent(userId)}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (detailsResult.statusCode !== 200 || !detailsResult.json || !detailsResult.json.success) {
    throw new Error('Admin user details API failed.');
  }

  const patchBody = {
    fullName: firstUser.fullName,
    phone: firstUser.phone || '',
    role: firstUser.role,
    status: firstUser.status,
  };

  const updateResult = await requestJson(`${backend}/api/v1/admin/users/${encodeURIComponent(userId)}`, {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(patchBody),
  });

  if (updateResult.statusCode !== 200 || !updateResult.json || !updateResult.json.success) {
    throw new Error('Admin user update API failed.');
  }

  const smokeEmail = `smoke.users.${Date.now()}@example.com`;
  const createResult = await requestJson(`${backend}/api/v1/admin/users`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      fullName: 'Smoke Users CRUD',
      email: smokeEmail,
      password: 'Sm0kePass!23',
      phone: '+20000000000',
      role: 'customer',
      status: 'active',
    }),
  });

  if (createResult.statusCode !== 201 || !createResult.json || !createResult.json.success || !createResult.json.data || !createResult.json.data._id) {
    throw new Error('Admin user create API failed.');
  }

  const createdUserId = createResult.json.data._id;

  const deleteResult = await requestJson(`${backend}/api/v1/admin/users/${encodeURIComponent(createdUserId)}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (deleteResult.statusCode !== 200 || !deleteResult.json || !deleteResult.json.success) {
    throw new Error('Admin user delete API failed.');
  }

  console.log('Users smoke test passed.');
  console.log(`Users checked: ${usersResult.json.data.length}`);
  console.log(`User checked: ${userId}`);
  console.log(`CRUD temp user: ${createdUserId}`);
  console.log(`Frontend base: ${frontend}`);
}

run().catch((error) => {
  console.error('Users smoke test failed:', error.message);
  process.exitCode = 1;
});
