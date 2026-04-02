const express = require('express');
const controller = require('./controller');
const { requireAdminAuth } = require('../auth/middleware');

const router = express.Router();

router.use(requireAdminAuth);
router.get('/locales', controller.getLocales);
router.get('/entries', controller.getEntries);
router.get('/extract-keywords', controller.extractKeywords);
router.post('/translate-keywords', controller.translateKeywords);
router.post('/entries', controller.saveEntry);

module.exports = router;
