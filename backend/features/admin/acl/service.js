const { RolePermission, ROLE_ENUM } = require('../../../models');

const DEFAULT_ROLE_PERMISSIONS = {
  super_admin: ['*'],
  admin: [
    'users.read',
    'users.write',
    'bookings.read',
    'bookings.write',
    'bookings.update',
    'contact.read',
    'contact.update',
    'i18n.read',
    'i18n.write',
    'blog.read',
    'blog.write',
    'services.read',
    'services.write',
    'cars.read',
    'cars.write',
    'drivers.read',
    'drivers.write',
    'emails.read',
    'emails.write',
    'acl.read',
    'acl.write',
    'settings.read',
    'settings.write',
    'settings.mail',
    'settings.site',
    'settings.logs',
    'notifications.write',
    'mediahub.read',
    'mediahub.write',
  ],
  dispatcher: [
    'users.read',
    'bookings.read',
    'bookings.write',
    'bookings.update',
    'contact.read',
    'emails.read',
    'acl.read',
  ],
  driver: ['bookings.read'],
  customer: [],
};

function dedupePermissions(permissions = []) {
  return Array.from(new Set((permissions || []).map((item) => String(item || '').trim()).filter(Boolean))).sort();
}

async function loadOverrides() {
  const rows = await RolePermission.find({}).lean();
  const map = new Map();
  rows.forEach((row) => {
    map.set(String(row.role || '').toLowerCase(), dedupePermissions(row.permissions || []));
  });
  return map;
}

async function listRoles() {
  const overrides = await loadOverrides();
  return ROLE_ENUM.map((role) => ({
    role,
    permissions: overrides.has(role)
      ? overrides.get(role)
      : dedupePermissions(DEFAULT_ROLE_PERMISSIONS[role] || []),
    source: overrides.has(role) ? 'override' : 'default',
  }));
}

async function listPermissions() {
  const overrides = await loadOverrides();
  const defaultPermissions = Object.values(DEFAULT_ROLE_PERMISSIONS).flat();
  const overridePermissions = Array.from(overrides.values()).flat();
  return dedupePermissions([...defaultPermissions, ...overridePermissions]);
}

async function getRolePermissions(role) {
  const normalizedRole = String(role || '').trim().toLowerCase();
  const override = await RolePermission.findOne({ role: normalizedRole }).lean();
  if (override && Array.isArray(override.permissions)) {
    return dedupePermissions(override.permissions);
  }
  return dedupePermissions(DEFAULT_ROLE_PERMISSIONS[normalizedRole] || []);
}

async function can(role, permission) {
  const permissions = await getRolePermissions(role);
  if (permissions.includes('*')) {
    return true;
  }
  if (permissions.includes(permission)) {
    return true;
  }

  const legacy = {
    'bookings.update': 'bookings.write',
    'settings.mail': 'settings.write',
    'settings.site': 'settings.write',
    'settings.logs': 'settings.write',
    'notifications.write': 'settings.write',
  };

  const alt = legacy[permission];
  if (alt && permissions.includes(alt)) {
    return true;
  }

  return false;
}

async function upsertRolePermissions(role, permissions = []) {
  const normalizedRole = String(role || '').trim().toLowerCase();
  const normalizedPermissions = dedupePermissions(permissions);

  const updated = await RolePermission.findOneAndUpdate(
    { role: normalizedRole },
    { $set: { role: normalizedRole, permissions: normalizedPermissions } },
    { upsert: true, new: true }
  ).lean();

  return {
    role: updated.role,
    permissions: dedupePermissions(updated.permissions || []),
    source: 'override',
  };
}

async function resetRolePermissions(role) {
  const normalizedRole = String(role || '').trim().toLowerCase();
  await RolePermission.deleteOne({ role: normalizedRole });
  return {
    role: normalizedRole,
    permissions: dedupePermissions(DEFAULT_ROLE_PERMISSIONS[normalizedRole] || []),
    source: 'default',
  };
}

module.exports = {
  ROLE_ENUM,
  listRoles,
  listPermissions,
  getRolePermissions,
  can,
  upsertRolePermissions,
  resetRolePermissions,
};
