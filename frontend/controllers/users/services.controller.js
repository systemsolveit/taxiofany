const servicesApi = require('../../services/servicesApi');

async function listServicesSafely() {
  try {
    const items = await servicesApi.listServices();
    return Array.isArray(items) ? items : [];
  } catch (error) {
    return [];
  }
}

exports.listPage = async (req, res) => {
  const services = await listServicesSafely();
  res.render('users/services/list', {
    services,
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
