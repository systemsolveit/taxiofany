const express = require('express');
const controller = require('../../controllers/admin/drivers.controller');

const router = express.Router();

router.get('/', controller.listPage);
router.get('/new', controller.newPage);
router.post('/new', controller.createDriver);
router.get('/:id/edit', controller.editPage);
router.post('/:id/update', controller.updateDriver);
router.post('/:id/delete', controller.deleteDriver);

module.exports = router;