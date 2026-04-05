const express = require('express');
const controller = require('./controller');

const router = express.Router();

router.get('/', controller.listTemplates);
router.get('/:slug', controller.getTemplate);

module.exports = router;
