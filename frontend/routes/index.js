const express = require('express');

const usersRouter = require('./users');
const adminRouter = require('./admin');
const mediahubController = require('../controllers/admin/mediahub.controller');

const router = express.Router();

router.use('/', usersRouter);
router.get('/mediahub/uploads/:filename', mediahubController.proxyAsset);
router.use('/admin', adminRouter);

router.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'frontend' });
});

module.exports = router;
