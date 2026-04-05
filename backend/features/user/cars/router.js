const express = require('express');
const controller = require('./controller');

const router = express.Router();

router.get('/', controller.listCars);
router.get('/:slug', controller.getCarValidation, controller.getCar);

module.exports = router;
