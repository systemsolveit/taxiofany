const express = require('express');
const controller = require('./controller');
const { requireAdminAuth, requireSuperAdmin } = require('../auth/middleware');

const router = express.Router();
const jsonLarge = express.json({ limit: '50mb' });

router.use(requireAdminAuth, requireSuperAdmin);

router.get('/export', controller.exportDatabase);
router.post('/import', jsonLarge, controller.importDatabase);
router.post('/reset-content', controller.resetContent);
router.post('/seed-demo', controller.seedDemo);

module.exports = router;
