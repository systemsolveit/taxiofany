const express = require('express');
const controller = require('./controller');

const router = express.Router();

router.get('/', controller.listDrivers);
router.get('/:slug', controller.getDriverValidation, controller.getDriver);

module.exports = router;