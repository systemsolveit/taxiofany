const accountApi = require('../../services/adminAccountApi');

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

exports.profilePage = async (req, res, next) => {
  const token = getAdminToken(req);
  if (!token) {
    return res.redirect('/admin/login');
  }

  try {
    const [profile, audit] = await Promise.all([
      accountApi.getProfile(token),
      accountApi.getAuditLog(token, { limit: 50, page: 1 }),
    ]);
    return res.render('admin/account/profile', {
      pageTitle: 'My profile',
      activeSection: 'account',
      profile,
      audit,
      notice: null,
    });
  } catch (error) {
    if (isAuthError(error)) {
      return redirectToLogin(req, res);
    }
    return next(error);
  }
};

exports.passwordPage = (req, res) => {
  if (!getAdminToken(req)) {
    return res.redirect('/admin/login');
  }
  return res.render('admin/account/password', {
    pageTitle: 'Change password',
    activeSection: 'account',
    errorMessage: null,
  });
};

exports.updatePassword = async (req, res) => {
  const token = getAdminToken(req);
  if (!token) {
    return res.redirect('/admin/login');
  }

  const { currentPassword, newPassword } = req.body;

  try {
    await accountApi.patchPassword(token, {
      currentPassword: String(currentPassword || ''),
      newPassword: String(newPassword || ''),
    });
    return res.render('admin/account/password', {
      pageTitle: 'Change password',
      activeSection: 'account',
      errorMessage: null,
      successMessage: 'Password updated successfully.',
    });
  } catch (error) {
    if (isAuthError(error)) {
      return redirectToLogin(req, res);
    }
    return res.render('admin/account/password', {
      pageTitle: 'Change password',
      activeSection: 'account',
      errorMessage: error.message || 'Could not update password.',
      successMessage: null,
    });
  }
};
