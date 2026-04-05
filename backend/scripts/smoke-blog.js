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
        res.on('end', () => {
          resolve({ statusCode: res.statusCode, body: data });
        });
      }
    );

    req.on('error', reject);
    if (options.body) {
      req.write(options.body);
    }
    req.end();
  });
}

function requestJson(url) {
  return new Promise((resolve, reject) => {
    const req = http.get(url, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        try {
          resolve({ statusCode: res.statusCode, body: data ? JSON.parse(data) : null });
        } catch (error) {
          reject(new Error(`Invalid JSON from ${url}: ${error.message}`));
        }
      });
    });
    req.on('error', reject);
  });
}

function requestText(url) {
  return new Promise((resolve, reject) => {
    const req = http.get(url, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        resolve({ statusCode: res.statusCode, body: data });
      });
    });
    req.on('error', reject);
  });
}

async function requestJsonWithMethod(url, method, body, headers = {}) {
  const raw = await requestRaw(url, {
    method,
    body: body ? JSON.stringify(body) : undefined,
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
  });

  return {
    statusCode: raw.statusCode,
    body: raw.body ? JSON.parse(raw.body) : null,
  };
}

async function firstReachable(candidates = []) {
  for (const candidate of candidates) {
    try {
      const result = await requestText(candidate);
      if (result.statusCode >= 200 && result.statusCode < 500) {
        return candidate;
      }
    } catch (error) {
      // try next candidate
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
    'http://localhost:3001/en/blog',
    'http://frontend:3001/en/blog',
  ]).then((url) => url.replace('/en/blog', ''));

  const listResult = await requestJson(`${backend}/api/v1/user/blog?limit=5`);
  if (listResult.statusCode !== 200 || !listResult.body || !listResult.body.success) {
    throw new Error('Blog list endpoint failed.');
  }

  const items = listResult.body.data && Array.isArray(listResult.body.data.items) ? listResult.body.data.items : [];
  if (!items.length) {
    throw new Error('Blog list returned no items.');
  }

  const firstSlug = items[0].slug;
  const detailsApi = await requestJson(`${backend}/api/v1/user/blog/${encodeURIComponent(firstSlug)}`);
  if (detailsApi.statusCode !== 200 || !detailsApi.body || !detailsApi.body.success) {
    throw new Error('Blog details API failed.');
  }

  const commentPayload = {
    name: 'Smoke User',
    email: 'smoke.user@example.com',
    message: `Smoke comment ${Date.now()}`,
  };
  const commentResult = await requestJsonWithMethod(
    `${backend}/api/v1/user/blog/${encodeURIComponent(firstSlug)}/comments`,
    'POST',
    commentPayload
  );
  if (commentResult.statusCode !== 201 || !commentResult.body || !commentResult.body.success) {
    throw new Error('Blog comment submit API failed.');
  }

  const adminToken = process.env.SMOKE_ADMIN_TOKEN || '';
  if (adminToken) {
    const createPayload = {
      title: 'Smoke Test Blog Post',
      slug: `smoke-test-post-${Date.now()}`,
      excerpt: 'Smoke test excerpt',
      content: 'Smoke test content',
      category: 'Smoke',
      authorName: 'Smoke Runner',
      coverImage: '/assets/img/post-1.jpg',
      tags: ['Smoke', 'QA'],
      isPublished: true,
    };

    const created = await requestJsonWithMethod(`${backend}/api/v1/admin/blog`, 'POST', createPayload, {
      Authorization: `Bearer ${adminToken}`,
    });

    if (created.statusCode !== 201 || !created.body || !created.body.success || !created.body.data || !created.body.data._id) {
      throw new Error('Admin blog create smoke test failed.');
    }

    const postId = created.body.data._id;
    const updated = await requestJsonWithMethod(`${backend}/api/v1/admin/blog/${encodeURIComponent(postId)}`, 'PATCH', {
      excerpt: 'Updated by smoke test',
    }, {
      Authorization: `Bearer ${adminToken}`,
    });

    if (updated.statusCode !== 200 || !updated.body || !updated.body.success) {
      throw new Error('Admin blog update smoke test failed.');
    }

    const removed = await requestJsonWithMethod(`${backend}/api/v1/admin/blog/${encodeURIComponent(postId)}`, 'DELETE', null, {
      Authorization: `Bearer ${adminToken}`,
    });

    if (removed.statusCode !== 200 || !removed.body || !removed.body.success) {
      throw new Error('Admin blog delete smoke test failed.');
    }
  }

  const pages = [
    `${frontend}/en/blog`,
    `${frontend}/en/blog/classic`,
    `${frontend}/en/blog/details/${encodeURIComponent(firstSlug)}`,
  ];

  for (const page of pages) {
    const response = await requestText(page);
    if (response.statusCode !== 200) {
      throw new Error(`Frontend page failed: ${page}`);
    }
  }

  console.log('Blog smoke test passed.');
  console.log(`Posts checked: ${items.length}`);
  console.log(`Slug checked: ${firstSlug}`);
  console.log(`Frontend base: ${frontend}`);
}

run().catch((error) => {
  console.error('Blog smoke test failed:', error.message);
  process.exitCode = 1;
});
