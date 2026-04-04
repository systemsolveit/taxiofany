const express = require('express');
const { param } = require('express-validator');
const controller = require('./controller');
const { requireAdminAuth } = require('../auth/middleware');
const validateRequest = require('../../../middlewares/validateRequest');
const {
	getEntriesValidation,
	extractKeywordsValidation,
	translateKeywordsValidation,
	saveEntryValidation,
	bulkSaveEntriesValidation,
	createLocaleValidation,
	updateLocaleValidation,
} = require('./validation');

const router = express.Router();

router.use(requireAdminAuth);
router.get('/locales', controller.getLocales);
router.get('/locale-registry', controller.getLocaleRegistry);
router.get('/pages', controller.getUiPages);
router.get('/entries', getEntriesValidation, validateRequest, controller.getEntries);
router.get('/extract-keywords', extractKeywordsValidation, validateRequest, controller.extractKeywords);
router.post('/translate-keywords', translateKeywordsValidation, validateRequest, controller.translateKeywords);
router.post('/entries', saveEntryValidation, validateRequest, controller.saveEntry);
router.post('/entries/bulk', bulkSaveEntriesValidation, validateRequest, controller.bulkSaveEntries);
router.post('/locales', createLocaleValidation, validateRequest, controller.createLocale);
router.patch('/locales/:code', updateLocaleValidation, validateRequest, controller.updateLocale);
router.post('/locales/:code/populate', param('code').isString().trim().notEmpty(), validateRequest, controller.populateLocaleFromBase);

module.exports = router;
