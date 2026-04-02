const express = require('express');
const controller = require('../../controllers/admin/users.controller');

const router = express.Router();

router.get('/', controller.listPage);
router.get('/:id', controller.detailsPage);

module.exports = router;
