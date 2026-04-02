const express = require('express');
const controller = require('../../controllers/admin/i18n.controller');

const router = express.Router();

router.get('/', controller.page);
router.post('/', controller.save);

module.exports = router;
