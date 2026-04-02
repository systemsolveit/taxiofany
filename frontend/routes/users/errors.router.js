const express = require('express');
const controller = require('../../controllers/users/errors.controller');

const router = express.Router();

router.get('/404', controller.notFoundPage);

module.exports = router;
