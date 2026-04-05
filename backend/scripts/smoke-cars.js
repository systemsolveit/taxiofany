const http = require('http');

function requestText(url) {
  return new Promise((resolve, reject) => {
    const req = http.get(url, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => resolve({ statusCode: res.statusCode, body: data }));
    });
    req.on('error', reject);
  });
}

function requestJson(url) {
  return requestText(url).then((result) => {
    try {
      return { statusCode: result.statusCode, body: result.body ? JSON.parse(result.body) : null };
    } catch (error) {
      throw new Error(`Invalid JSON from ${url}: ${error.message}`);
    }
  });
}

async function firstReachable(candidates = []) {
  for (const candidate of candidates) {
    try {
      const result = await requestText(candidate);
      if (result.statusCode >= 200 && result.statusCode < 500) {
        return candidate;
      }
    } catch (error) {
      // next
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
    'http://localhost:3001/en/taxi',
    'http://frontend:3001/en/taxi',
  ]).then((url) => url.replace('/en/taxi', ''));

  const listResult = await requestJson(`${backend}/api/v1/user/cars`);
  if (listResult.statusCode !== 200 || !listResult.body || !listResult.body.success) {
    throw new Error('Cars list endpoint failed.');
  }

  const items = Array.isArray(listResult.body.data) ? listResult.body.data : [];
  if (!items.length) {
    throw new Error('Cars list returned no items.');
  }

  const firstSlug = items[0].slug;
  const detailsResult = await requestJson(`${backend}/api/v1/user/cars/${encodeURIComponent(firstSlug)}`);
  if (detailsResult.statusCode !== 200 || !detailsResult.body || !detailsResult.body.success) {
    throw new Error('Car details endpoint failed.');
  }

  const pages = [
    `${frontend}/en/taxi`,
    `${frontend}/en/taxi/details/${encodeURIComponent(firstSlug)}`,
  ];

  for (const page of pages) {
    const response = await requestText(page);
    if (response.statusCode !== 200) {
      throw new Error(`Frontend page failed: ${page}`);
    }
  }

  console.log('Cars smoke test passed.');
  console.log(`Cars checked: ${items.length}`);
  console.log(`Slug checked: ${firstSlug}`);
  console.log(`Frontend base: ${frontend}`);
}

run().catch((error) => {
  console.error('Cars smoke test failed:', error.message);
  process.exitCode = 1;
});
