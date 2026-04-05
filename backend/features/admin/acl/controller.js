const service = require('./service');

async function roles(req, res, next) {
  try {
    const data = await service.listRoles();
    res.json({
      success: true,
      data,
    });
  } catch (error) {
    next(error);
  }
}

async function permissions(req, res, next) {
  try {
    const data = await service.listPermissions();
    res.json({
      success: true,
      data,
    });
  } catch (error) {
    next(error);
  }
}

async function check(req, res, next) {
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

  try {
    return res.json({
      success: true,
      data: {
        role,
        permission,
        allowed: await service.can(role, permission),
        grantedPermissions: await service.getRolePermissions(role),
      },
    });
  } catch (error) {
    return next(error);
  }
}

async function myPermissions(req, res, next) {
  const role = req.auth.role;
  try {
    return res.json({
      success: true,
      data: {
        role,
        permissions: await service.getRolePermissions(role),
      },
    });
  } catch (error) {
    return next(error);
  }
}

async function updateRolePermissions(req, res, next) {
  try {
    const data = await service.upsertRolePermissions(req.params.role, req.body.permissions || []);
    return res.json({ success: true, data });
  } catch (error) {
    return next(error);
  }
}

async function resetRolePermissions(req, res, next) {
  try {
    const data = await service.resetRolePermissions(req.params.role);
    return res.json({ success: true, data });
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  roles,
  permissions,
  check,
  myPermissions,
  updateRolePermissions,
  resetRolePermissions,
};
