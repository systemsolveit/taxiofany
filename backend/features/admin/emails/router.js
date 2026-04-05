const express = require('express');
const controller = require('./controller');
const validateRequest = require('../../../middlewares/validateRequest');
const { requireAdminAuth } = require('../auth/middleware');
const { templateIdValidation, createTemplateValidation, updateTemplateValidation } = require('./validation');

const router = express.Router();

router.get('/', requireAdminAuth, controller.listTemplates);
router.post('/', requireAdminAuth, createTemplateValidation, validateRequest, controller.createTemplate);
router.get('/:id', requireAdminAuth, templateIdValidation, validateRequest, controller.getTemplate);
router.patch('/:id', requireAdminAuth, updateTemplateValidation, validateRequest, controller.updateTemplate);
router.delete('/:id', requireAdminAuth, templateIdValidation, validateRequest, controller.deleteTemplate);

module.exports = router;
