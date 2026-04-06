const express = require('express');
const controller = require('./controller');
const validateRequest = require('../../../middlewares/validateRequest');
const { requireAdminAuth, requirePermission } = require('../auth/middleware');
const { PERMISSIONS } = require('../auth/permissionsCatalog');
const { carIdValidation, createCarValidation, updateCarValidation } = require('./validation');

const router = express.Router();

router.get('/', requireAdminAuth, requirePermission(PERMISSIONS.CARS_READ), controller.listCars);
router.get('/:id', requireAdminAuth, requirePermission(PERMISSIONS.CARS_READ), carIdValidation, validateRequest, controller.getCar);
router.post('/', requireAdminAuth, requirePermission(PERMISSIONS.CARS_WRITE), createCarValidation, validateRequest, controller.createCar);
router.patch('/:id', requireAdminAuth, requirePermission(PERMISSIONS.CARS_WRITE), updateCarValidation, validateRequest, controller.updateCar);
router.delete('/:id', requireAdminAuth, requirePermission(PERMISSIONS.CARS_WRITE), carIdValidation, validateRequest, controller.deleteCar);

module.exports = router;
