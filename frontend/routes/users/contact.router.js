const express = require('express');
const controller = require('../../controllers/users/contact.controller');

const router = express.Router();

router.get('/contact', controller.indexPage);
router.post('/contact/send', controller.submitMessage);

module.exports = router;
