const express = require('express');
const controller = require('./controller');
const validateRequest = require('../../../middlewares/validateRequest');
const { requireAdminAuth, requirePermission } = require('../auth/middleware');
const { PERMISSIONS } = require('../auth/permissionsCatalog');
const { templateIdValidation, createTemplateValidation, updateTemplateValidation } = require('./validation');

const router = express.Router();

router.get('/', requireAdminAuth, requirePermission(PERMISSIONS.EMAILS_READ), controller.listTemplates);
router.post(
  '/',
  requireAdminAuth,
  requirePermission(PERMISSIONS.EMAILS_WRITE),
  createTemplateValidation,
  validateRequest,
  controller.createTemplate
);
router.get(
  '/:id/preview',
  requireAdminAuth,
  requirePermission(PERMISSIONS.EMAILS_READ),
  templateIdValidation,
  validateRequest,
  controller.previewTemplate
);
router.get('/:id', requireAdminAuth, requirePermission(PERMISSIONS.EMAILS_READ), templateIdValidation, validateRequest, controller.getTemplate);
router.patch(
  '/:id',
  requireAdminAuth,
  requirePermission(PERMISSIONS.EMAILS_WRITE),
  updateTemplateValidation,
  validateRequest,
  controller.updateTemplate
);
router.delete(
  '/:id',
  requireAdminAuth,
  requirePermission(PERMISSIONS.EMAILS_WRITE),
  templateIdValidation,
  validateRequest,
  controller.deleteTemplate
);

module.exports = router;
