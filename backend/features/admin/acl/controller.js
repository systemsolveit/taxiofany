const service = require('./service');

function roles(req, res) {
  res.json({
    success: true,
    data: service.listRoles(),
  });
}

function permissions(req, res) {
  res.json({
    success: true,
    data: service.listPermissions(),
  });
}

function check(req, res) {
  const { role, permission } = req.body;

  if (!role || !permission) {
    return res.status(400).json({
      success: false,
      error: {
        code: 'VALIDATION_ERROR',
        message: 'role and permission are required.',
      },
    });
  }

  return res.json({
    success: true,
    data: {
      role,
      permission,
      allowed: service.can(role, permission),
      grantedPermissions: service.getRolePermissions(role),
    },
  });
}

function myPermissions(req, res) {
  const role = req.auth.role;
  return res.json({
    success: true,
    data: {
      role,
      permissions: service.getRolePermissions(role),
    },
  });
}

module.exports = {
  roles,
  permissions,
  check,
  myPermissions,
};
