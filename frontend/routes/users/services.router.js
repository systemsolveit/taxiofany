const express = require('express');
const controller = require('../../controllers/users/services.controller');

const router = express.Router();

router.get('/services', controller.listPage);
router.get('/services/details', controller.detailsPage);

module.exports = router;
