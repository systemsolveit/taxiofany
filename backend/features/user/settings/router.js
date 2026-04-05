const express = require('express');
const controller = require('./controller');

const router = express.Router();

router.get('/site', controller.getPublicSiteSettings);

module.exports = router;
