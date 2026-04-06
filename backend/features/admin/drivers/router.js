const express = require('express');
const controller = require('./controller');
const validateRequest = require('../../../middlewares/validateRequest');
const { requireAdminAuth, requirePermission } = require('../auth/middleware');
const { PERMISSIONS } = require('../auth/permissionsCatalog');
const { driverIdValidation, createDriverValidation, updateDriverValidation } = require('./validation');

const router = express.Router();

router.get('/', requireAdminAuth, requirePermission(PERMISSIONS.DRIVERS_READ), controller.listDrivers);
router.get('/:id', requireAdminAuth, requirePermission(PERMISSIONS.DRIVERS_READ), driverIdValidation, validateRequest, controller.getDriver);
router.post('/', requireAdminAuth, requirePermission(PERMISSIONS.DRIVERS_WRITE), createDriverValidation, validateRequest, controller.createDriver);
router.patch('/:id', requireAdminAuth, requirePermission(PERMISSIONS.DRIVERS_WRITE), updateDriverValidation, validateRequest, controller.updateDriver);
router.delete('/:id', requireAdminAuth, requirePermission(PERMISSIONS.DRIVERS_WRITE), driverIdValidation, validateRequest, controller.deleteDriver);

module.exports = router;