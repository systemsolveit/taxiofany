const express = require('express');
const controller = require('../../controllers/admin/contact.controller');

const router = express.Router();

router.get('/', controller.listPage);
router.get('/:id', controller.detailsPage);
router.post('/:id/update', controller.updateSubmission);

module.exports = router;