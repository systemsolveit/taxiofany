const express = require('express');
const controller = require('../../controllers/admin/database.controller');

const router = express.Router();

router.get('/', controller.databasePage);
router.get('/export.json', controller.exportJson);
router.post('/import', controller.importJson);
router.post('/reset', controller.resetContent);
router.post('/seed', controller.seedDemo);

module.exports = router;
