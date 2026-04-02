const service = require('./service');

function requireClientAuth(req, res, next) {
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

    const payload = service.verifyToken(token);
    if (payload.role !== 'customer') {
      return res.status(403).json({
        success: false,
        error: {
          code: 'ROLE_NOT_ALLOWED',
          message: 'Client role is required.',
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
  requireClientAuth,
};
