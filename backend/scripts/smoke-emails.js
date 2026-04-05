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
    'http://localhost:3001/emails',
    'http://frontend:3001/emails',
  ]).then((url) => url.replace('/emails', ''));

  const email = process.env.SMOKE_ADMIN_EMAIL || process.env.SUPER_ADMIN_EMAIL || '';
  const password = process.env.SMOKE_ADMIN_PASSWORD || process.env.SUPER_ADMIN_PASSWORD || '';

  if (!email || !password) {
    throw new Error('Admin credentials are required for email smoke test.');
  }

  const loginResult = await requestJson(`${backend}/api/v1/admin/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  if (loginResult.statusCode !== 200 || !loginResult.json || !loginResult.json.success || !loginResult.json.data || !loginResult.json.data.token) {
    throw new Error('Admin login failed in email smoke test.');
  }

  const token = loginResult.json.data.token;
  const slug = `smoke-email-${Date.now()}`;

  const createResult = await requestJson(`${backend}/api/v1/admin/emails`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      title: 'Smoke Email Template',
      slug,
      category: 'Transactional',
      audience: 'Customers',
      subject: 'Smoke subject',
      previewText: 'Smoke preview',
      summary: 'Smoke summary',
      heroTitle: 'Smoke hero',
      heroDescription: 'Smoke hero description',
      bodyTitle: 'Smoke body title',
      bodyContent: 'Smoke body content',
      ctaLabel: 'Open',
      ctaUrl: '/services',
      tone: 'Professional',
      isPublished: true,
      displayOrder: 99,
    }),
  });

  if (createResult.statusCode !== 201 || !createResult.json || !createResult.json.success || !createResult.json.data || !createResult.json.data._id) {
    throw new Error('Admin email create API failed.');
  }

  const createdId = createResult.json.data._id;

  const listResult = await requestJson(`${backend}/api/v1/admin/emails`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (listResult.statusCode !== 200 || !listResult.json || !listResult.json.success || !Array.isArray(listResult.json.data)) {
    throw new Error('Admin email list API failed.');
  }

  const getResult = await requestJson(`${backend}/api/v1/admin/emails/${encodeURIComponent(createdId)}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (getResult.statusCode !== 200 || !getResult.json || !getResult.json.success) {
    throw new Error('Admin email details API failed.');
  }

  const updateResult = await requestJson(`${backend}/api/v1/admin/emails/${encodeURIComponent(createdId)}`, {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      title: 'Smoke Email Template Updated',
      slug,
      category: 'Transactional',
      audience: 'Customers',
      subject: 'Smoke subject updated',
      previewText: 'Smoke preview updated',
      summary: 'Smoke summary updated',
      heroTitle: 'Smoke hero',
      heroDescription: 'Smoke hero description',
      bodyTitle: 'Smoke body title',
      bodyContent: 'Smoke body content updated',
      ctaLabel: 'Open',
      ctaUrl: '/services',
      tone: 'Professional',
      isPublished: true,
      displayOrder: 99,
    }),
  });
  if (updateResult.statusCode !== 200 || !updateResult.json || !updateResult.json.success) {
    throw new Error('Admin email update API failed.');
  }

  const publicList = await requestRaw(`${frontend}/emails`);
  if (![200, 301, 302].includes(publicList.statusCode)) {
    throw new Error('Public emails list page check failed.');
  }

  const publicDetails = await requestRaw(`${frontend}/emails/${encodeURIComponent(slug)}`);
  if (![200, 301, 302].includes(publicDetails.statusCode)) {
    throw new Error('Public email details page check failed.');
  }

  const deleteResult = await requestJson(`${backend}/api/v1/admin/emails/${encodeURIComponent(createdId)}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (deleteResult.statusCode !== 200 || !deleteResult.json || !deleteResult.json.success) {
    throw new Error('Admin email delete API failed.');
  }

  console.log('Emails smoke test passed.');
  console.log(`Templates visible in admin: ${listResult.json.data.length}`);
  console.log(`Public template slug: ${slug}`);
  console.log(`Frontend base: ${frontend}`);
}

run().catch((error) => {
  console.error('Emails smoke test failed:', error.message);
  process.exitCode = 1;
});
