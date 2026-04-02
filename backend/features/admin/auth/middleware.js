const { ADMIN_ROLES, verifyToken } = require('./service');

function requireAdminAuth(req, res, next) {
  try {
    const header = req.headers.authorization || '';
    const [scheme, token] = header.split(' ');

    if (scheme !== 'Bearer' || !token) {
      return res.status(401).json({
        success: false,
        error: {
          code: 'MISSING_TOKEN',
          message: 'Authorization Bearer token is required.',
        },
      });
    }

    const payload = verifyToken(token);

    if (!ADMIN_ROLES.has(payload.role)) {
      return res.status(403).json({
        success: false,
        error: {
          code: 'ROLE_NOT_ALLOWED',
          message: 'Admin role is required.',
        },
      });
    }

    req.auth = payload;
    return next();
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  requireAdminAuth,
};
