const ROLE_PERMISSIONS = {
  super_admin: [
    '*',
  ],
  admin: [
    'users.read',
    'users.write',
    'bookings.read',
    'bookings.write',
    'acl.read',
    'acl.write',
  ],
  dispatcher: [
    'users.read',
    'bookings.read',
    'bookings.write',
    'acl.read',
  ],
  driver: [
    'bookings.read',
  ],
  customer: [],
};

function listRoles() {
  return Object.keys(ROLE_PERMISSIONS).map((role) => ({
    role,
    permissions: ROLE_PERMISSIONS[role],
  }));
}

function listPermissions() {
  return Array.from(new Set(Object.values(ROLE_PERMISSIONS).flat())).sort();
}

function getRolePermissions(role) {
  return ROLE_PERMISSIONS[role] || [];
}

function can(role, permission) {
  const permissions = getRolePermissions(role);
  return permissions.includes('*') || permissions.includes(permission);
}

module.exports = {
  listRoles,
  listPermissions,
  getRolePermissions,
  can,
};
