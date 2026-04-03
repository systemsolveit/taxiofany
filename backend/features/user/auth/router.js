const express = require('express');
const controller = require('./controller');
const { requireClientAuth } = require('./middleware');
const validateRequest = require('../../../middlewares/validateRequest');
const { registerValidation, loginValidation } = require('./validation');

const router = express.Router();

/**
 * @openapi
 * /api/v1/user/auth/register:
 *   post:
 *     tags: [User Auth]
 *     summary: Register new client user
 *     responses:
 *       201:
 *         description: User registered
 */
router.post('/register', registerValidation, validateRequest, controller.register);

/**
 * @openapi
 * /api/v1/user/auth/login:
 *   post:
 *     tags: [User Auth]
 *     summary: Login client user
 *     responses:
 *       200:
 *         description: User logged in
 */
router.post('/login', loginValidation, validateRequest, controller.login);

/**
 * @openapi
 * /api/v1/user/auth/me:
 *   get:
 *     tags: [User Auth]
 *     summary: Get authenticated user profile
 *     responses:
 *       200:
 *         description: User profile returned
 */
router.get('/me', requireClientAuth, controller.me);

module.exports = router;
