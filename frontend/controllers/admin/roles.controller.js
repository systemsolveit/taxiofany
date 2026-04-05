const aclApi = require('../../services/adminAclApi');

function consumeNotice(req) {
  const notice = req.session ? req.session.rolesNotice : null;
  if (req.session) {
    delete req.session.rolesNotice;
  }
  return notice;
}

function setNotice(req, type, message) {
  if (req.session) {
    req.session.rolesNotice = { type, message };
  }
}

function getAdminToken(req) {
  return req.session && req.session.admin ? req.session.admin.token : null;
}

exports.listPage = async (req, res, next) => {
  const token = getAdminToken(req);
  if (!token) {
    return res.redirect('/admin/login');
  }

  try {
    const [roles, permissions] = await Promise.all([
      aclApi.listRoles(token),
      aclApi.listPermissions(token),
    ]);

    return res.render('admin/roles/list', {
      pageTitle: 'Roles Management',
      activeSection: 'roles',
      roles,
      permissions,
      notice: consumeNotice(req),
    });
  } catch (error) {
    return next(error);
  }
};

exports.updateRole = async (req, res) => {
  const token = getAdminToken(req);
  if (!token) {
    return res.redirect('/admin/login');
  }

  const role = String(req.params.role || '').trim().toLowerCase();
  const permissions = Array.isArray(req.body.permissions)
    ? req.body.permissions
    : (req.body.permissions ? [req.body.permissions] : []);

  try {
    await aclApi.updateRolePermissions(token, role, permissions);
    setNotice(req, 'success', `Permissions updated for role "${role}".`);
  } catch (error) {
    setNotice(req, 'danger', `Update failed: ${error.message}`);
  }

  return res.redirect('/admin/roles');
};

exports.resetRole = async (req, res) => {
  const token = getAdminToken(req);
  if (!token) {
    return res.redirect('/admin/login');
  }

  const role = String(req.params.role || '').trim().toLowerCase();
  try {
    await aclApi.resetRolePermissions(token, role);
    setNotice(req, 'success', `Role "${role}" reset to default permissions.`);
  } catch (error) {
    setNotice(req, 'danger', `Reset failed: ${error.message}`);
  }

  return res.redirect('/admin/roles');
};
