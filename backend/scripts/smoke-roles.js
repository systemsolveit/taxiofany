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
    let json = null;
    if (result.body) {
      try {
        json = JSON.parse(result.body);
      } catch (error) {
        throw new Error(`Invalid JSON from ${url}: ${error.message}`);
      }
    }
    return { statusCode: result.statusCode, body: json };
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
    'http://localhost:3001/admin/roles',
    'http://frontend:3001/admin/roles',
  ]).then((url) => url.replace('/admin/roles', ''));

  const pageResult = await requestRaw(`${frontend}/admin/roles`);
  if (![200, 301, 302].includes(pageResult.statusCode)) {
    throw new Error('Frontend admin roles page check failed.');
  }

  const email = process.env.SMOKE_ADMIN_EMAIL || process.env.SUPER_ADMIN_EMAIL || '';
  const password = process.env.SMOKE_ADMIN_PASSWORD || process.env.SUPER_ADMIN_PASSWORD || '';

  if (!email || !password) {
    console.log('Roles smoke test passed (frontend route check only; admin API checks skipped due missing credentials).');
    console.log(`Frontend base: ${frontend}`);
    return;
  }

  const loginResult = await requestJson(`${backend}/api/v1/admin/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  if (loginResult.statusCode !== 200 || !loginResult.body || !loginResult.body.success || !loginResult.body.data || !loginResult.body.data.token) {
    throw new Error('Admin login failed in roles smoke test.');
  }

  const token = loginResult.body.data.token;

  const rolesResult = await requestJson(`${backend}/api/v1/admin/acl/roles`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (rolesResult.statusCode !== 200 || !rolesResult.body || !rolesResult.body.success || !Array.isArray(rolesResult.body.data)) {
    throw new Error('ACL roles endpoint failed.');
  }

  const permissionsResult = await requestJson(`${backend}/api/v1/admin/acl/permissions`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (permissionsResult.statusCode !== 200 || !permissionsResult.body || !permissionsResult.body.success || !Array.isArray(permissionsResult.body.data)) {
    throw new Error('ACL permissions endpoint failed.');
  }

  const targetRole = rolesResult.body.data.find((item) => item.role === 'admin') || rolesResult.body.data[0];
  if (!targetRole) {
    throw new Error('No role found to validate update flow.');
  }

  const updateResult = await requestJson(`${backend}/api/v1/admin/acl/roles/${encodeURIComponent(targetRole.role)}`, {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ permissions: targetRole.permissions || [] }),
  });

  if (updateResult.statusCode !== 200 || !updateResult.body || !updateResult.body.success) {
    throw new Error('ACL role update endpoint failed.');
  }

  console.log('Roles smoke test passed.');
  console.log(`Roles checked: ${rolesResult.body.data.length}`);
  console.log(`Permissions catalog: ${permissionsResult.body.data.length}`);
  console.log(`Frontend base: ${frontend}`);
}

run().catch((error) => {
  console.error('Roles smoke test failed:', error.message);
  process.exitCode = 1;
});
