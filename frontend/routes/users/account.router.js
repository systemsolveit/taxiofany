const express = require('express');
const controller = require('../../controllers/users/account.controller');
const { requireClientSession, redirectClientIfAuthenticated } = require('../../middleware/clientSessionAuth');

const router = express.Router();

router.get('/account/register', redirectClientIfAuthenticated, controller.registerPage);
router.post('/account/register', redirectClientIfAuthenticated, controller.register);

router.get('/account/login', redirectClientIfAuthenticated, controller.loginPage);
router.post('/account/login', redirectClientIfAuthenticated, controller.login);

router.get('/account/forgot-password', redirectClientIfAuthenticated, controller.forgotPasswordPage);

router.get('/account', requireClientSession, controller.accountPage);
router.get('/account/trips', requireClientSession, controller.tripsPage);
router.get('/account/password', requireClientSession, controller.passwordPage);
router.post('/account/password', requireClientSession, controller.updatePassword);
router.post('/account/logout', requireClientSession, controller.logout);

module.exports = router;
