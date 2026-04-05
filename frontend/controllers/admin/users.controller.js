const usersApi = require('../../services/adminUsersApi');

function consumeNotice(req) {
  const notice = req.session ? req.session.usersNotice : null;
  if (req.session) {
    delete req.session.usersNotice;
  }
  return notice;
}

function setNotice(req, type, message) {
  if (req.session) {
    req.session.usersNotice = { type, message };
  }
}

function getAdminToken(req) {
  return req.session && req.session.admin ? req.session.admin.token : null;
}

function isAuthError(error) {
  return error && (error.statusCode === 401 || error.statusCode === 403);
}

function redirectToLogin(req, res, message) {
  if (req.session) {
    delete req.session.admin;
    req.session.authError = message || 'Your admin session expired. Please log in again.';
  }
  return res.redirect('/admin/login');
}

function formatStatus(status) {
  const value = String(status || 'pending').trim().toLowerCase();
  if (value === 'active') return 'Active';
  if (value === 'suspended') return 'Suspended';
  return 'Pending';
}

function formatRole(role) {
  const value = String(role || 'customer').trim().toLowerCase();
  if (!value) return 'customer';
  return value;
}

exports.listPage = async (req, res, next) => {
  const token = getAdminToken(req);
  if (!token) {
    return res.redirect('/admin/login');
  }

  try {
    const users = await usersApi.listUsers(token);
    return res.render('admin/users/list', {
      pageTitle: 'Admin Users',
      activeSection: 'users',
      users,
      notice: consumeNotice(req),
    });
  } catch (error) {
    if (isAuthError(error)) {
      return redirectToLogin(req, res);
    }
    return next(error);
  }
};

exports.createPage = (req, res) => {
  const formValues = req.session && req.session.usersCreateForm
    ? req.session.usersCreateForm
    : {
        fullName: '',
        email: '',
        phone: '',
        role: 'customer',
        status: 'active',
      };

  if (req.session) {
    delete req.session.usersCreateForm;
  }

  return res.render('admin/users/create', {
    pageTitle: 'Create User',
    activeSection: 'users',
    notice: consumeNotice(req),
    formValues,
  });
};

exports.detailsPage = async (req, res, next) => {
  const token = getAdminToken(req);
  if (!token) {
    return res.redirect('/admin/login');
  }

  try {
    const user = await usersApi.getUser(token, req.params.id);
    return res.render('admin/users/details', {
      pageTitle: 'Admin User Details',
      activeSection: 'users',
      user,
      notice: consumeNotice(req),
    });
  } catch (error) {
    if (isAuthError(error)) {
      return redirectToLogin(req, res);
    }
    return next(error);
  }
};

exports.updateUser = async (req, res) => {
  const token = getAdminToken(req);
  if (!token) {
    return res.redirect('/admin/login');
  }

  try {
    const updated = await usersApi.updateUser(token, req.params.id, {
      fullName: String(req.body.fullName || '').trim(),
      phone: String(req.body.phone || '').trim(),
      role: formatRole(req.body.role),
      status: String(req.body.status || '').trim().toLowerCase(),
    });
    setNotice(req, 'success', `User "${updated.fullName}" updated successfully.`);
  } catch (error) {
    if (isAuthError(error)) {
      return redirectToLogin(req, res);
    }
    setNotice(req, 'danger', `Update failed: ${error.message}`);
  }

  return res.redirect(`/admin/users/${encodeURIComponent(req.params.id)}`);
};

exports.createUser = async (req, res) => {
  const token = getAdminToken(req);
  if (!token) {
    return res.redirect('/admin/login');
  }

  try {
    const created = await usersApi.createUser(token, {
      fullName: String(req.body.fullName || '').trim(),
      email: String(req.body.email || '').trim().toLowerCase(),
      password: String(req.body.password || ''),
      phone: String(req.body.phone || '').trim(),
      role: formatRole(req.body.role),
      status: String(req.body.status || '').trim().toLowerCase(),
    });
    setNotice(req, 'success', `User "${created.fullName}" created successfully.`);
    return res.redirect(`/admin/users/${encodeURIComponent(created._id)}`);
  } catch (error) {
    if (isAuthError(error)) {
      return redirectToLogin(req, res);
    }

    if (req.session) {
      req.session.usersNotice = { type: 'danger', message: `Create failed: ${error.message}` };
      req.session.usersCreateForm = {
        fullName: String(req.body.fullName || '').trim(),
        email: String(req.body.email || '').trim().toLowerCase(),
        phone: String(req.body.phone || '').trim(),
        role: formatRole(req.body.role),
        status: String(req.body.status || 'active').trim().toLowerCase(),
      };
    }

    return res.redirect('/admin/users/create');
  }
};

exports.deleteUser = async (req, res) => {
  const token = getAdminToken(req);
  if (!token) {
    return res.redirect('/admin/login');
  }

  try {
    const deleted = await usersApi.deleteUser(token, req.params.id);
    setNotice(req, 'success', `User "${deleted.fullName}" deleted successfully.`);
  } catch (error) {
    if (isAuthError(error)) {
      return redirectToLogin(req, res);
    }
    setNotice(req, 'danger', `Delete failed: ${error.message}`);
  }

  return res.redirect('/admin/users');
};
