const express = require('express');
const controller = require('./controller');
const { requireAdminAuth, requirePermission } = require('../auth/middleware');
const { PERMISSIONS } = require('../auth/permissionsCatalog');
const validateRequest = require('../../../middlewares/validateRequest');
const { checkAclValidation, updateRoleValidation, roleParamValidation } = require('./validation');

const router = express.Router();

router.use(requireAdminAuth);

router.get('/roles', requirePermission(PERMISSIONS.ACL_READ), controller.roles);
router.get('/permissions', requirePermission(PERMISSIONS.ACL_READ), controller.permissions);
router.patch(
  '/roles/:role',
  requirePermission(PERMISSIONS.ACL_WRITE),
  updateRoleValidation,
  validateRequest,
  controller.updateRolePermissions
);
router.delete(
  '/roles/:role',
  requirePermission(PERMISSIONS.ACL_WRITE),
  roleParamValidation,
  validateRequest,
  controller.resetRolePermissions
);
router.post('/check', requirePermission(PERMISSIONS.ACL_READ), checkAclValidation, validateRequest, controller.check);
router.get('/me', requirePermission(PERMISSIONS.ACL_READ), controller.myPermissions);

module.exports = router;
