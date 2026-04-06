const databaseApi = require('../../services/adminDatabaseApi');

function getAdminToken(req) {
  return req.session && req.session.admin ? req.session.admin.token : null;
}

function isAuthError(error) {
  return error && (error.statusCode === 401 || error.statusCode === 403);
}

function redirectToLogin(req, res) {
  if (req.session) {
    delete req.session.admin;
    req.session.authError = 'Your admin session expired. Please log in again.';
  }
  return res.redirect('/admin/login');
}

function consumeNotice(req) {
  const notice = req.session ? req.session.databaseNotice : null;
  if (req.session) {
    delete req.session.databaseNotice;
  }
  return notice;
}

function setNotice(req, type, message) {
  if (req.session) {
    req.session.databaseNotice = { type, message };
  }
}

exports.databasePage = async (req, res, next) => {
  const token = getAdminToken(req);
  if (!token) {
    return res.redirect('/admin/login');
  }

  const role = req.session.admin && req.session.admin.user ? req.session.admin.user.role : '';
  if (role !== 'super_admin') {
    setNotice(req, 'danger', 'Database management is restricted to super administrators.');
    return res.redirect('/admin');
  }

  try {
    return res.render('admin/database/index', {
      pageTitle: 'Database management',
      activeSection: 'database',
      notice: consumeNotice(req),
    });
  } catch (error) {
    return next(error);
  }
};

exports.exportJson = async (req, res, next) => {
  const token = getAdminToken(req);
  if (!token) {
    return res.redirect('/admin/login');
  }

  try {
    const data = await databaseApi.exportDatabase(token);
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.setHeader('Content-Disposition', 'attachment; filename="taxiofany-export.json"');
    return res.send(JSON.stringify(data, null, 2));
  } catch (error) {
    if (isAuthError(error)) {
      return redirectToLogin(req, res);
    }
    setNotice(req, 'danger', error.message || 'Export failed.');
    return res.redirect('/admin/database');
  }
};

exports.importJson = async (req, res) => {
  const token = getAdminToken(req);
  if (!token) {
    return res.redirect('/admin/login');
  }

  let payload = {};
  try {
    const raw = req.body && req.body.payload ? String(req.body.payload).trim() : '';
    if (raw) {
      payload = JSON.parse(raw);
    }
  } catch (e) {
    setNotice(req, 'danger', 'Invalid JSON payload.');
    return res.redirect('/admin/database');
  }

  try {
    const dryRun = req.body.dryRun === 'on' || req.body.dryRun === 'true';
    const result = await databaseApi.importDatabase(token, payload, dryRun);
    setNotice(req, 'success', dryRun ? `Dry run complete: ${JSON.stringify(result.stats)}` : 'Import completed.');
  } catch (error) {
    if (isAuthError(error)) {
      return redirectToLogin(req, res);
    }
    setNotice(req, 'danger', error.message || 'Import failed.');
  }

  return res.redirect('/admin/database');
};

exports.resetContent = async (req, res) => {
  const token = getAdminToken(req);
  if (!token) {
    return res.redirect('/admin/login');
  }

  try {
    await databaseApi.resetContent(token, { confirm: String(req.body.confirm || '') });
    setNotice(req, 'success', 'Content collections were reset. Super admin accounts were preserved.');
  } catch (error) {
    if (isAuthError(error)) {
      return redirectToLogin(req, res);
    }
    setNotice(req, 'danger', error.message || 'Reset failed.');
  }

  return res.redirect('/admin/database');
};

exports.seedDemo = async (req, res) => {
  const token = getAdminToken(req);
  if (!token) {
    return res.redirect('/admin/login');
  }

  try {
    await databaseApi.seedDemo(token);
    setNotice(req, 'success', 'Demo content seeded (idempotent keys).');
  } catch (error) {
    if (isAuthError(error)) {
      return redirectToLogin(req, res);
    }
    setNotice(req, 'danger', error.message || 'Seed failed.');
  }

  return res.redirect('/admin/database');
};
