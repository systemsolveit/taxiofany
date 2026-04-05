const express = require('express');
const controller = require('./controller');
const validateRequest = require('../../../middlewares/validateRequest');
const { requireAdminAuth } = require('../auth/middleware');
const { driverIdValidation, createDriverValidation, updateDriverValidation } = require('./validation');

const router = express.Router();

router.get('/', requireAdminAuth, controller.listDrivers);
router.get('/:id', requireAdminAuth, driverIdValidation, validateRequest, controller.getDriver);
router.post('/', requireAdminAuth, createDriverValidation, validateRequest, controller.createDriver);
router.patch('/:id', requireAdminAuth, updateDriverValidation, validateRequest, controller.updateDriver);
router.delete('/:id', requireAdminAuth, driverIdValidation, validateRequest, controller.deleteDriver);

module.exports = router;