const servicesApi = require('../../services/adminServicesApi');

function consumeNotice(req) {
  const notice = req.session ? req.session.servicesNotice : null;
  if (req.session) {
    delete req.session.servicesNotice;
  }
  return notice;
}

function setNotice(req, type, message) {
  if (req.session) {
    req.session.servicesNotice = { type, message };
  }
}

function getAdminToken(req) {
  return req.session && req.session.admin ? req.session.admin.token : null;
}

function formatList(value) {
  if (Array.isArray(value)) {
    return value.map((item) => String(item || '').trim()).filter(Boolean).join(', ');
  }
  return String(value || '').trim();
}

function mapPayload(body = {}) {
  return {
    title: String(body.title || '').trim(),
    slug: String(body.slug || '').trim(),
    shortDescription: String(body.shortDescription || '').trim(),
    description: String(body.description || '').trim(),
    category: String(body.category || '').trim(),
    iconClass: String(body.iconClass || '').trim(),
    coverImage: String(body.coverImage || '').trim(),
    featureImage: String(body.featureImage || '').trim(),
    benefitsImage: String(body.benefitsImage || '').trim(),
    features: String(body.features || '').trim(),
    benefitPoints: formatList(body.benefitPoints),
    tags: formatList(body.tags),
    displayOrder: Number(body.displayOrder) || 0,
    isPublished: body.isPublished === 'true' || body.isPublished === 'on',
  };
}

exports.listPage = async (req, res, next) => {
  const token = getAdminToken(req);
  if (!token) {
    return res.redirect('/admin/login');
  }

  try {
    const items = await servicesApi.listServices(token);
    return res.render('admin/services/list', {
      pageTitle: 'Services Management',
      activeSection: 'services',
      services: items,
      notice: consumeNotice(req),
    });
  } catch (error) {
    return next(error);
  }
};

exports.newPage = async (req, res) => {
  const token = getAdminToken(req);
  if (!token) {
    return res.redirect('/admin/login');
  }

  return res.render('admin/services/form', {
    pageTitle: 'Create Service',
    activeSection: 'services',
    mode: 'create',
    service: {
      title: '',
      slug: '',
      shortDescription: '',
      description: '',
      category: 'General',
      iconClass: 'las la-taxi',
      coverImage: '/assets/img/service-1.jpg',
      featureImage: '/assets/img/post-2.jpg',
      benefitsImage: '/assets/img/post-1.jpg',
      features: [],
      benefitPoints: [],
      tags: [],
      displayOrder: 0,
      isPublished: false,
    },
    notice: consumeNotice(req),
  });
};

exports.editPage = async (req, res, next) => {
  const token = getAdminToken(req);
  if (!token) {
    return res.redirect('/admin/login');
  }

  try {
    const item = await servicesApi.getService(token, req.params.id);
    return res.render('admin/services/form', {
      pageTitle: 'Edit Service',
      activeSection: 'services',
      mode: 'edit',
      service: item,
      notice: consumeNotice(req),
    });
  } catch (error) {
    return next(error);
  }
};

exports.createService = async (req, res) => {
  const token = getAdminToken(req);
  if (!token) {
    return res.redirect('/admin/login');
  }

  try {
    const item = await servicesApi.createService(token, mapPayload(req.body));
    setNotice(req, 'success', `Service "${item.title}" created successfully.`);
    return res.redirect('/admin/services');
  } catch (error) {
    setNotice(req, 'danger', `Create failed: ${error.message}`);
    return res.redirect('/admin/services/new');
  }
};

exports.updateService = async (req, res) => {
  const token = getAdminToken(req);
  if (!token) {
    return res.redirect('/admin/login');
  }

  try {
    const item = await servicesApi.updateService(token, req.params.id, mapPayload(req.body));
    setNotice(req, 'success', `Service "${item.title}" updated successfully.`);
  } catch (error) {
    setNotice(req, 'danger', `Update failed: ${error.message}`);
  }

  return res.redirect('/admin/services');
};

exports.togglePublished = async (req, res) => {
  const token = getAdminToken(req);
  if (!token) {
    return res.redirect('/admin/login');
  }

  try {
    const current = await servicesApi.getService(token, req.params.id);
    const nextPublished = !current.isPublished;
    await servicesApi.updateService(token, req.params.id, { isPublished: nextPublished });
    setNotice(
      req,
      'success',
      nextPublished
        ? `Service "${current.title}" is now shown on the public site.`
        : `Service "${current.title}" is now a draft (hidden from the public site).`,
    );
  } catch (error) {
    setNotice(req, 'danger', `Status update failed: ${error.message}`);
  }

  return res.redirect('/admin/services');
};

exports.deleteService = async (req, res) => {
  const token = getAdminToken(req);
  if (!token) {
    return res.redirect('/admin/login');
  }

  try {
    await servicesApi.deleteService(token, req.params.id);
    setNotice(req, 'success', 'Service deleted successfully.');
  } catch (error) {
    setNotice(req, 'danger', `Delete failed: ${error.message}`);
  }

  return res.redirect('/admin/services');
};
