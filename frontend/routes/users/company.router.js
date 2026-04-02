const express = require('express');
const controller = require('../../controllers/users/company.controller');

const router = express.Router();

router.get('/about', controller.aboutUs);
router.get('/about/company', controller.aboutCompany);

module.exports = router;
