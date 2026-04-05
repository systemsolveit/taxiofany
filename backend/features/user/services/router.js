const express = require('express');
const controller = require('./controller');

const router = express.Router();

router.get('/', controller.listServices);
router.get('/:slug', controller.getServiceValidation, controller.getService);

module.exports = router;
