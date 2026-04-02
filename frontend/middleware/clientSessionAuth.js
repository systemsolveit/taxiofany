function requireClientSession(req, res, next) {
  if (req.session && req.session.client && req.session.client.token) {
    return next();
  }

  return res.redirect('/account/login');
}

function redirectClientIfAuthenticated(req, res, next) {
  if (req.session && req.session.client && req.session.client.token) {
    return res.redirect('/account');
  }

  return next();
}

module.exports = {
  requireClientSession,
  redirectClientIfAuthenticated,
};
