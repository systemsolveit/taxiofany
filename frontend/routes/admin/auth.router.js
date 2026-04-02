const express = require('express');
const controller = require('../../controllers/admin/auth.controller');
const { redirectIfAuthenticated } = require('../../middleware/adminSessionAuth');

const router = express.Router();

router.get('/login', redirectIfAuthenticated, controller.loginPage);
router.post('/login', redirectIfAuthenticated, controller.login);
router.post('/logout', controller.logout);

module.exports = router;
