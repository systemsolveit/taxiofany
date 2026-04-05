const express = require('express');
const controller = require('../../controllers/users/drivers.controller');

const router = express.Router();

router.get('/drivers', controller.listPage);
router.get('/drivers/details/:slug', controller.detailsPage);
router.get('/drivers/details', controller.detailsPage);
router.get('/testimonials', controller.testimonialsPage);

module.exports = router;
