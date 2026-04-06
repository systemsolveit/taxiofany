function clientLocalePrefix(res) {
  const locale = res.locals && res.locals.locale ? String(res.locals.locale).toLowerCase() : 'nl';
  return locale || 'nl';
}

function requireClientSession(req, res, next) {
  if (req.session && req.session.client && req.session.client.token) {
    return next();
  }

  const loc = clientLocalePrefix(res);
  return res.redirect(`/${loc}/account/login`);
}

function redirectClientIfAuthenticated(req, res, next) {
  if (req.session && req.session.client && req.session.client.token) {
    const loc = clientLocalePrefix(res);
    return res.redirect(`/${loc}/account`);
  }

  return next();
}

module.exports = {
  requireClientSession,
  redirectClientIfAuthenticated,
};
