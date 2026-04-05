const express = require('express');
const controller = require('./controller');
const validateRequest = require('../../../middlewares/validateRequest');
const { requireAdminAuth } = require('../auth/middleware');
const { carIdValidation, createCarValidation, updateCarValidation } = require('./validation');

const router = express.Router();

router.get('/', requireAdminAuth, controller.listCars);
router.get('/:id', requireAdminAuth, carIdValidation, validateRequest, controller.getCar);
router.post('/', requireAdminAuth, createCarValidation, validateRequest, controller.createCar);
router.patch('/:id', requireAdminAuth, updateCarValidation, validateRequest, controller.updateCar);
router.delete('/:id', requireAdminAuth, carIdValidation, validateRequest, controller.deleteCar);

module.exports = router;
