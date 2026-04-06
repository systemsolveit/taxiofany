const express = require('express');
const controller = require('./controller');
const validateRequest = require('../../../middlewares/validateRequest');
const { userIdValidation, updateUserValidation, createUserValidation } = require('./validation');
const { requireAdminAuth, requirePermission } = require('../auth/middleware');
const { PERMISSIONS } = require('../auth/permissionsCatalog');

const router = express.Router();

router.get('/', requireAdminAuth, requirePermission(PERMISSIONS.USERS_READ), controller.listUsers);
router.post(
  '/',
  requireAdminAuth,
  requirePermission(PERMISSIONS.USERS_WRITE),
  createUserValidation,
  validateRequest,
  controller.createUser
);
router.get('/:id', requireAdminAuth, requirePermission(PERMISSIONS.USERS_READ), userIdValidation, validateRequest, controller.getUser);
router.patch(
  '/:id',
  requireAdminAuth,
  requirePermission(PERMISSIONS.USERS_WRITE),
  updateUserValidation,
  validateRequest,
  controller.updateUser
);
router.delete(
  '/:id',
  requireAdminAuth,
  requirePermission(PERMISSIONS.USERS_WRITE),
  userIdValidation,
  validateRequest,
  controller.deleteUser
);

module.exports = router;
