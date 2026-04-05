const express = require('express');
const controller = require('../../controllers/users/emails.controller');

const router = express.Router();

router.get('/emails', controller.listPage);
router.get('/emails/:slug', controller.detailsPage);

module.exports = router;
