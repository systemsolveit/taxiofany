const express = require('express');
const controller = require('./controller');
const { requireAdminAuth } = require('./middleware');
const validateRequest = require('../../../middlewares/validateRequest');
const { loginValidation } = require('./validation');

const router = express.Router();

/**
 * @openapi
 * /api/v1/admin/auth/login:
 *   post:
 *     tags: [Admin Auth]
 *     summary: Login admin user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Admin login succeeded
 */
router.post('/login', loginValidation, validateRequest, controller.login);

/**
 * @openapi
 * /api/v1/admin/auth/me:
 *   get:
 *     tags: [Admin Auth]
 *     summary: Get authenticated admin profile
 *     responses:
 *       200:
 *         description: Admin profile returned
 */
router.get('/me', requireAdminAuth, controller.me);

module.exports = router;
