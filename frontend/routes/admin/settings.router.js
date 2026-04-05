const express = require('express');
const controller = require('../../controllers/admin/settings.controller');

const router = express.Router();

router.get('/mail', controller.mailSettingsPage);
router.post('/mail/update', controller.updateMailSettings);
router.post('/mail/test', controller.testMailSettings);
router.get('/site', controller.siteSettingsPage);
router.post('/site/update', controller.updateSiteSettings);

module.exports = router;
