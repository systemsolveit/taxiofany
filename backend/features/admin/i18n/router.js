const express = require('express');
const controller = require('./controller');
const { requireAdminAuth } = require('../auth/middleware');
const validateRequest = require('../../../middlewares/validateRequest');
const {
	getEntriesValidation,
	extractKeywordsValidation,
	translateKeywordsValidation,
	saveEntryValidation,
} = require('./validation');

const router = express.Router();

router.use(requireAdminAuth);
router.get('/locales', controller.getLocales);
router.get('/entries', getEntriesValidation, validateRequest, controller.getEntries);
router.get('/extract-keywords', extractKeywordsValidation, validateRequest, controller.extractKeywords);
router.post('/translate-keywords', translateKeywordsValidation, validateRequest, controller.translateKeywords);
router.post('/entries', saveEntryValidation, validateRequest, controller.saveEntry);

module.exports = router;
