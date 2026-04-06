const { ADMIN_ROLES, verifyToken } = require('./service');
const aclService = require('../acl/service');

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

function requirePermission(permission) {
  return async function requirePermissionMiddleware(req, res, next) {
    try {
      if (!req.auth || !req.auth.role) {
        return res.status(401).json({
          success: false,
          error: {
            code: 'UNAUTHORIZED',
            message: 'Authentication required.',
          },
        });
      }

      if (req.auth.role === 'super_admin') {
        return next();
      }

      const allowed = await aclService.can(req.auth.role, permission);
      if (!allowed) {
        return res.status(403).json({
          success: false,
          error: {
            code: 'FORBIDDEN',
            message: 'You do not have permission to perform this action.',
          },
        });
      }

      return next();
    } catch (error) {
      return next(error);
    }
  };
}

function requireAnyPermission(...permissions) {
  return async function requireAnyPermissionMiddleware(req, res, next) {
    try {
      if (!req.auth || !req.auth.role) {
        return res.status(401).json({
          success: false,
          error: {
            code: 'UNAUTHORIZED',
            message: 'Authentication required.',
          },
        });
      }

      if (req.auth.role === 'super_admin') {
        return next();
      }

      /* eslint-disable no-await-in-loop */
      for (let i = 0; i < permissions.length; i += 1) {
        const allowed = await aclService.can(req.auth.role, permissions[i]);
        if (allowed) {
          return next();
        }
      }
      /* eslint-enable no-await-in-loop */

      return res.status(403).json({
        success: false,
        error: {
          code: 'FORBIDDEN',
          message: 'You do not have permission to perform this action.',
        },
      });
    } catch (error) {
      return next(error);
    }
  };
}

function requireSuperAdmin(req, res, next) {
  try {
    if (!req.auth || !req.auth.role) {
      return res.status(401).json({
        success: false,
        error: {
          code: 'UNAUTHORIZED',
          message: 'Authentication required.',
        },
      });
    }

    if (req.auth.role !== 'super_admin') {
      return res.status(403).json({
        success: false,
        error: {
          code: 'FORBIDDEN',
          message: 'Super administrator role is required.',
        },
      });
    }

    return next();
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  requireAdminAuth,
  requirePermission,
  requireAnyPermission,
  requireSuperAdmin,
};
