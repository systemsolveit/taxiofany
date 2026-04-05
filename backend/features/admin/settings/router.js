const express = require('express');
const controller = require('./controller');
const { requireAdminAuth } = require('../auth/middleware');
const validateRequest = require('../../../middlewares/validateRequest');
const { mailSettingsValidation, siteSettingsValidation } = require('./validation');

const router = express.Router();

router.get('/mail', requireAdminAuth, controller.getMailSettings);
router.patch('/mail', requireAdminAuth, mailSettingsValidation, validateRequest, controller.updateMailSettings);
router.post('/mail/test', requireAdminAuth, mailSettingsValidation, validateRequest, controller.testMailSettings);
router.get('/site', requireAdminAuth, controller.getSiteSettings);
router.patch('/site', requireAdminAuth, siteSettingsValidation, validateRequest, controller.updateSiteSettings);

module.exports = router;
