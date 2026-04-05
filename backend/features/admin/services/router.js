const express = require('express');
const controller = require('./controller');
const validateRequest = require('../../../middlewares/validateRequest');
const { requireAdminAuth } = require('../auth/middleware');
const { serviceIdValidation, createServiceValidation, updateServiceValidation } = require('./validation');

const router = express.Router();

router.get('/', requireAdminAuth, controller.listServices);
router.get('/:id', requireAdminAuth, serviceIdValidation, validateRequest, controller.getService);
router.post('/', requireAdminAuth, createServiceValidation, validateRequest, controller.createService);
router.patch('/:id', requireAdminAuth, updateServiceValidation, validateRequest, controller.updateService);
router.delete('/:id', requireAdminAuth, serviceIdValidation, validateRequest, controller.deleteService);

module.exports = router;
