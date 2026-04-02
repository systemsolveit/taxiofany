const express = require('express');
const controller = require('./controller');

const router = express.Router();

router.get('/locales', controller.getLocales);
router.get('/:locale', controller.getDictionary);

module.exports = router;
