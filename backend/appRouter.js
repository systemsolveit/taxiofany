const express = require('express');
const { connection } = require('./config/database');
const config = require('./config');
const { createApiRateLimiter } = require('./middlewares/rateLimit');
const adminFeaturesRouter = require('./features/admin');
const userFeaturesRouter = require('./features/user');

const router = express.Router();
const apiRateLimiter = createApiRateLimiter(config);

/**
 * @openapi
 * /api/v1/status:
 *   get:
 *     tags: [System]
 *     summary: Get API and database status
 *     responses:
 *       200:
 *         description: Service health returned
 */
router.get('/api/v1/status', (req, res) => {
  res.json({
    success: true,
    data: {
      status: 'ok',
      uptime: process.uptime(),
      database: connection.readyState === 1 ? 'connected' : 'disconnected',
    },
  });
});

router.use('/api/v1', apiRateLimiter);
router.use('/api/v1/admin', adminFeaturesRouter);
router.use('/api/v1/user', userFeaturesRouter);

module.exports = router;
