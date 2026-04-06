const express = require('express');
const controller = require('./controller');
const { requireAdminAuth } = require('../auth/middleware');
const validateRequest = require('../../../middlewares/validateRequest');
const {
  mailSettingsValidation,
  mailTestValidation,
  notificationsSettingsValidation,
  siteSettingsValidation,
} = require('./validation');
const { requirePermission, requireAnyPermission } = require('../auth/middleware');
const { PERMISSIONS } = require('../auth/permissionsCatalog');

const router = express.Router();

router.get('/mail', requireAdminAuth, requirePermission(PERMISSIONS.SETTINGS_MAIL), controller.getMailSettings);
router.patch(
  '/mail',
  requireAdminAuth,
  requirePermission(PERMISSIONS.SETTINGS_MAIL),
  mailSettingsValidation,
  validateRequest,
  controller.updateMailSettings
);
router.post(
  '/mail/test',
  requireAdminAuth,
  requirePermission(PERMISSIONS.SETTINGS_MAIL),
  mailTestValidation,
  validateRequest,
  controller.testMailSettings
);
router.get('/site', requireAdminAuth, requirePermission(PERMISSIONS.SETTINGS_SITE), controller.getSiteSettings);
router.patch(
  '/site',
  requireAdminAuth,
  requirePermission(PERMISSIONS.SETTINGS_SITE),
  siteSettingsValidation,
  validateRequest,
  controller.updateSiteSettings
);
router.get('/logs', requireAdminAuth, requirePermission(PERMISSIONS.SETTINGS_LOGS), controller.getLogs);
router.get(
  '/notifications',
  requireAdminAuth,
  requireAnyPermission(PERMISSIONS.EMAILS_READ, PERMISSIONS.NOTIFICATIONS_WRITE),
  controller.getNotificationsSettings
);
router.patch(
  '/notifications',
  requireAdminAuth,
  requirePermission(PERMISSIONS.NOTIFICATIONS_WRITE),
  notificationsSettingsValidation,
  validateRequest,
  controller.patchNotificationsSettings
);

module.exports = router;
