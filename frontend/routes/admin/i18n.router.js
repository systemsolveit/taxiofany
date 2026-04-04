const express = require('express');
const controller = require('../../controllers/admin/i18n.controller');

const router = express.Router();

router.get('/', controller.page);
router.post('/', controller.save);
router.post('/bulk-save', controller.bulkSave);
router.post('/actions/translate', controller.translateKeywordsJson);
router.post('/actions/bulk-save', controller.bulkSaveJson);
router.post('/actions/locales/:code/populate', controller.populateLocaleJson);
router.post('/locales', controller.createLocale);
router.post('/locales/:code', controller.updateLocale);

module.exports = router;
