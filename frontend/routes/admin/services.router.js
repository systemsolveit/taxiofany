const express = require('express');
const controller = require('../../controllers/admin/services.controller');

const router = express.Router();

router.get('/', controller.listPage);
router.get('/new', controller.newPage);
router.post('/new', controller.createService);
router.post('/:id/toggle-published', controller.togglePublished);
router.get('/:id/edit', controller.editPage);
router.post('/:id/update', controller.updateService);
router.post('/:id/delete', controller.deleteService);

module.exports = router;
