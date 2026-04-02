const express = require('express');
const controller = require('./controller');
const { requireClientAuth } = require('./middleware');

const router = express.Router();

router.post('/register', controller.register);
router.post('/login', controller.login);
router.get('/me', requireClientAuth, controller.me);

module.exports = router;
