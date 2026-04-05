const express = require('express');
const controller = require('../../controllers/admin/roles.controller');

const router = express.Router();

router.get('/', controller.listPage);
router.post('/:role/update', controller.updateRole);
router.post('/:role/reset', controller.resetRole);

module.exports = router;
