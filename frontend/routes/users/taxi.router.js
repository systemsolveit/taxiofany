const express = require('express');
const controller = require('../../controllers/users/taxi.controller');

const router = express.Router();

router.get('/taxi', controller.listPage);
router.get('/taxi/details/:slug', controller.detailsPage);
router.get('/taxi/details', controller.detailsPage);

module.exports = router;
