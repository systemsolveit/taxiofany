const express = require('express');
const controller = require('../../controllers/admin/bookings.controller');

const router = express.Router();

router.get('/', controller.listPage);
router.get('/:id', controller.detailsPage);

module.exports = router;
