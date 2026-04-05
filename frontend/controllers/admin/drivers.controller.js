const driversApi = require('../../services/adminDriversApi');

function consumeNotice(req) {
  const notice = req.session ? req.session.driversNotice : null;
  if (req.session) {
    delete req.session.driversNotice;
  }
  return notice;
}

function setNotice(req, type, message) {
  if (req.session) {
    req.session.driversNotice = { type, message };
  }
}

function getAdminToken(req) {
  return req.session && req.session.admin ? req.session.admin.token : null;
}

function mapPayload(body = {}) {
  return {
    fullName: String(body.fullName || '').trim(),
    slug: String(body.slug || '').trim(),
    roleTitle: String(body.roleTitle || '').trim(),
    phone: String(body.phone || '').trim(),
    image: String(body.image || '').trim(),
    detailImage: String(body.detailImage || '').trim(),
    carType: String(body.carType || '').trim(),
    plateNumber: String(body.plateNumber || '').trim(),
    languages: String(body.languages || '').trim(),
    bio: String(body.bio || '').trim(),
    experienceYears: Number(body.experienceYears),
    displayOrder: Number(body.displayOrder) || 0,
    isPublished: body.isPublished === 'true' || body.isPublished === 'on',
    availability: String(body.availability || 'available').trim(),
  };
}

exports.listPage = async (req, res, next) => {
  const token = getAdminToken(req);
  if (!token) {
    return res.redirect('/admin/login');
  }

  try {
    const drivers = await driversApi.listDrivers(token);
    return res.render('admin/drivers/list', {
      pageTitle: 'Drivers Management',
      activeSection: 'drivers',
      drivers,
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

  return res.render('admin/drivers/form', {
    pageTitle: 'Create Driver',
    activeSection: 'drivers',
    mode: 'create',
    driver: {
      fullName: '',
      slug: '',
      roleTitle: 'Professional Driver',
      phone: '',
      image: '/assets/img/team-1.jpg',
      detailImage: '/assets/img/team-details.jpg',
      carType: '',
      plateNumber: '',
      languages: '',
      bio: '',
      experienceYears: 5,
      displayOrder: 0,
      isPublished: true,
      availability: 'available',
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
    const driver = await driversApi.getDriver(token, req.params.id);
    return res.render('admin/drivers/form', {
      pageTitle: 'Edit Driver',
      activeSection: 'drivers',
      mode: 'edit',
      driver,
      notice: consumeNotice(req),
    });
  } catch (error) {
    return next(error);
  }
};

exports.createDriver = async (req, res) => {
  const token = getAdminToken(req);
  if (!token) {
    return res.redirect('/admin/login');
  }

  try {
    const driver = await driversApi.createDriver(token, mapPayload(req.body));
    setNotice(req, 'success', `Driver "${driver.fullName}" created successfully.`);
    return res.redirect('/admin/drivers');
  } catch (error) {
    setNotice(req, 'danger', `Create failed: ${error.message}`);
    return res.redirect('/admin/drivers/new');
  }
};

exports.updateDriver = async (req, res) => {
  const token = getAdminToken(req);
  if (!token) {
    return res.redirect('/admin/login');
  }

  try {
    const driver = await driversApi.updateDriver(token, req.params.id, mapPayload(req.body));
    setNotice(req, 'success', `Driver "${driver.fullName}" updated successfully.`);
  } catch (error) {
    setNotice(req, 'danger', `Update failed: ${error.message}`);
  }

  return res.redirect('/admin/drivers');
};

exports.deleteDriver = async (req, res) => {
  const token = getAdminToken(req);
  if (!token) {
    return res.redirect('/admin/login');
  }

  try {
    await driversApi.deleteDriver(token, req.params.id);
    setNotice(req, 'success', 'Driver deleted successfully.');
  } catch (error) {
    setNotice(req, 'danger', `Delete failed: ${error.message}`);
  }

  return res.redirect('/admin/drivers');
};