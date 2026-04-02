const express = require('express');
const { connection } = require('./config/database');
const adminFeaturesRouter = require('./features/admin');
const userFeaturesRouter = require('./features/user');

const router = express.Router();

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

router.use('/api/v1/admin', adminFeaturesRouter);
router.use('/api/v1/user', userFeaturesRouter);

module.exports = router;
