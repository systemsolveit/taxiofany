const express = require('express');
const controller = require('./controller');
const { requireAdminAuth } = require('./middleware');

const router = express.Router();

router.post('/login', controller.login);
router.get('/me', requireAdminAuth, controller.me);

module.exports = router;
