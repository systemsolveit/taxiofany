function requireAdminSession(req, res, next) {
  if (req.session && req.session.admin && req.session.admin.token) {
    return next();
  }

  return res.redirect('/admin/login');
}

function redirectIfAuthenticated(req, res, next) {
  if (req.session && req.session.admin && req.session.admin.token) {
    return res.redirect('/admin');
  }

  return next();
}

module.exports = {
  requireAdminSession,
  redirectIfAuthenticated,
};
