const express = require('express');
const controller = require('./controller');
const validateRequest = require('../../../middlewares/validateRequest');
const { dictionaryLocaleValidation } = require('./validation');

const router = express.Router();

router.get('/locales', controller.getLocales);
router.get('/:locale', dictionaryLocaleValidation, validateRequest, controller.getDictionary);

module.exports = router;
