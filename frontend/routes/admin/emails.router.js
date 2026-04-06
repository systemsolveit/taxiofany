const express = require('express');
const controller = require('../../controllers/admin/emails.controller');

const router = express.Router();

router.get('/', controller.listPage);
router.get('/new', controller.newPage);
router.post('/new', controller.createTemplate);
router.get('/preview/:id', controller.previewHtml);
router.get('/:id/edit', controller.editPage);
router.post('/:id/update', controller.updateTemplate);
router.post('/:id/delete', controller.deleteTemplate);

module.exports = router;
