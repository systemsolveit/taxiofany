const express = require('express');
const controller = require('../../controllers/users/support.controller');

const router = express.Router();

router.get('/faqs', controller.faqsPage);

module.exports = router;
