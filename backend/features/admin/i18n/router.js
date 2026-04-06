const express = require('express');
const { param } = require('express-validator');
const controller = require('./controller');
const { requireAdminAuth, requirePermission } = require('../auth/middleware');
const { PERMISSIONS } = require('../auth/permissionsCatalog');
const validateRequest = require('../../../middlewares/validateRequest');
const {
	getEntriesValidation,
	extractKeywordsValidation,
	translateKeywordsValidation,
	saveEntryValidation,
	bulkSaveEntriesValidation,
	createLocaleValidation,
	updateLocaleValidation,
} = require('./validation');

const router = express.Router();

router.get('/locales', requireAdminAuth, requirePermission(PERMISSIONS.I18N_READ), controller.getLocales);
router.get('/locale-registry', requireAdminAuth, requirePermission(PERMISSIONS.I18N_READ), controller.getLocaleRegistry);
router.get('/pages', requireAdminAuth, requirePermission(PERMISSIONS.I18N_READ), controller.getUiPages);
router.get('/entries', requireAdminAuth, requirePermission(PERMISSIONS.I18N_READ), getEntriesValidation, validateRequest, controller.getEntries);
router.get(
  '/extract-keywords',
  requireAdminAuth,
  requirePermission(PERMISSIONS.I18N_READ),
  extractKeywordsValidation,
  validateRequest,
  controller.extractKeywords
);
router.post(
  '/translate-keywords',
  requireAdminAuth,
  requirePermission(PERMISSIONS.I18N_WRITE),
  translateKeywordsValidation,
  validateRequest,
  controller.translateKeywords
);
router.post('/entries', requireAdminAuth, requirePermission(PERMISSIONS.I18N_WRITE), saveEntryValidation, validateRequest, controller.saveEntry);
router.post(
  '/entries/bulk',
  requireAdminAuth,
  requirePermission(PERMISSIONS.I18N_WRITE),
  bulkSaveEntriesValidation,
  validateRequest,
  controller.bulkSaveEntries
);
router.post('/locales', requireAdminAuth, requirePermission(PERMISSIONS.I18N_WRITE), createLocaleValidation, validateRequest, controller.createLocale);
router.patch('/locales/:code', requireAdminAuth, requirePermission(PERMISSIONS.I18N_WRITE), updateLocaleValidation, validateRequest, controller.updateLocale);
router.post(
  '/locales/:code/populate',
  requireAdminAuth,
  requirePermission(PERMISSIONS.I18N_WRITE),
  param('code').isString().trim().notEmpty(),
  validateRequest,
  controller.populateLocaleFromBase
);

module.exports = router;
