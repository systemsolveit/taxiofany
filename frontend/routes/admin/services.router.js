const express = require('express');
const controller = require('../../controllers/admin/services.controller');

const router = express.Router();

router.get('/', controller.listPage);
router.get('/new', controller.newPage);
router.post('/new', controller.createService);
router.get('/:id/edit', controller.editPage);
router.post('/:id/update', controller.updateService);
router.post('/:id/delete', controller.deleteService);

module.exports = router;
