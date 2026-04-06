const express = require('express');
const controller = require('./controller');
const validateRequest = require('../../../middlewares/validateRequest');
const { requireAdminAuth, requirePermission } = require('../auth/middleware');
const { PERMISSIONS } = require('../auth/permissionsCatalog');
const { serviceIdValidation, createServiceValidation, updateServiceValidation } = require('./validation');

const router = express.Router();

router.get('/', requireAdminAuth, requirePermission(PERMISSIONS.SERVICES_READ), controller.listServices);
router.get('/:id', requireAdminAuth, requirePermission(PERMISSIONS.SERVICES_READ), serviceIdValidation, validateRequest, controller.getService);
router.post('/', requireAdminAuth, requirePermission(PERMISSIONS.SERVICES_WRITE), createServiceValidation, validateRequest, controller.createService);
router.patch('/:id', requireAdminAuth, requirePermission(PERMISSIONS.SERVICES_WRITE), updateServiceValidation, validateRequest, controller.updateService);
router.delete('/:id', requireAdminAuth, requirePermission(PERMISSIONS.SERVICES_WRITE), serviceIdValidation, validateRequest, controller.deleteService);

module.exports = router;
