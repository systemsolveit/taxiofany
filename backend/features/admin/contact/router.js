const express = require('express');
const controller = require('./controller');
const validateRequest = require('../../../middlewares/validateRequest');
const { requireAdminAuth, requirePermission } = require('../auth/middleware');
const { PERMISSIONS } = require('../auth/permissionsCatalog');
const { submissionIdValidation, updateSubmissionValidation } = require('./validation');

const router = express.Router();

router.get('/submissions', requireAdminAuth, requirePermission(PERMISSIONS.CONTACT_READ), controller.listSubmissions);
router.get(
  '/submissions/:id',
  requireAdminAuth,
  requirePermission(PERMISSIONS.CONTACT_READ),
  submissionIdValidation,
  validateRequest,
  controller.getSubmission
);
router.patch(
  '/submissions/:id',
  requireAdminAuth,
  requirePermission(PERMISSIONS.CONTACT_UPDATE),
  updateSubmissionValidation,
  validateRequest,
  controller.updateSubmission
);

module.exports = router;
