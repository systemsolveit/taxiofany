const servicesApi = require('../../services/servicesApi');
const blogApi = require('../../services/blogApi');

async function listServicesSafely() {
  try {
    const items = await servicesApi.listServices();
    return Array.isArray(items) ? items : [];
  } catch (error) {
    return [];
  }
}

async function listLatestBlogPostsSafely(limit = 3) {
  try {
    const result = await blogApi.listPosts({ page: 1, limit });
    return result && Array.isArray(result.items) ? result.items : [];
  } catch (error) {
    return [];
  }
}

exports.listPage = async (req, res) => {
  const [services, latestBlogPosts] = await Promise.all([
    listServicesSafely(),
    listLatestBlogPostsSafely(3),
  ]);
  res.render('users/services/list', {
    services,
    latestBlogPosts,
  });
};

exports.detailsPage = async (req, res) => {
  const slug = req.params.slug || req.query.service;
  const services = await listServicesSafely();
  let service = null;

  if (slug) {
    try {
      service = await servicesApi.getServiceBySlug(slug);
    } catch (error) {
      service = null;
    }
  }

  if (!service && services.length) {
    service = services[0];
  }

  res.render('users/services/details', {
    service,
    services,
  });
};
