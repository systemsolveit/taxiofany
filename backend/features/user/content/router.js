const express = require('express');
const controller = require('./controller');

const router = express.Router();

router.get('/testimonials', controller.listTestimonials);
router.get('/packages', controller.listPackages);

module.exports = router;
