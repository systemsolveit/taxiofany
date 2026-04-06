/**
 * Permission strings for admin API enforcement (see requirePermission middleware).
 * super_admin bypasses checks; other roles use RolePermission + defaults in acl/service.
 */
const PERMISSIONS = {
  BOOKINGS_READ: 'bookings.read',
  BOOKINGS_UPDATE: 'bookings.update',
  CONTACT_READ: 'contact.read',
  CONTACT_UPDATE: 'contact.update',
  I18N_READ: 'i18n.read',
  I18N_WRITE: 'i18n.write',
  BLOG_READ: 'blog.read',
  BLOG_WRITE: 'blog.write',
  SERVICES_READ: 'services.read',
  SERVICES_WRITE: 'services.write',
  CARS_READ: 'cars.read',
  CARS_WRITE: 'cars.write',
  DRIVERS_READ: 'drivers.read',
  DRIVERS_WRITE: 'drivers.write',
  EMAILS_READ: 'emails.read',
  EMAILS_WRITE: 'emails.write',
  ACL_READ: 'acl.read',
  ACL_WRITE: 'acl.write',
  USERS_READ: 'users.read',
  USERS_WRITE: 'users.write',
  SETTINGS_READ: 'settings.read',
  SETTINGS_WRITE: 'settings.write',
  SETTINGS_MAIL: 'settings.mail',
  SETTINGS_SITE: 'settings.site',
  SETTINGS_LOGS: 'settings.logs',
  NOTIFICATIONS_WRITE: 'notifications.write',
  MEDIAHUB_READ: 'mediahub.read',
  MEDIAHUB_WRITE: 'mediahub.write',
  DATABASE_EXPORT: 'database.export',
  DATABASE_IMPORT: 'database.import',
  DATABASE_RESET: 'database.reset',
  DATABASE_SEED: 'database.seed',
};

const ALL_PERMISSIONS = Object.values(PERMISSIONS);

module.exports = {
  PERMISSIONS,
  ALL_PERMISSIONS,
};
