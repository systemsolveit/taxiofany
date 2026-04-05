const express = require('express');
const controller = require('../../controllers/admin/users.controller');

const router = express.Router();

router.get('/', controller.listPage);
router.get('/create', controller.createPage);
router.post('/create', controller.createUser);
router.get('/:id', controller.detailsPage);
router.post('/:id/update', controller.updateUser);
router.post('/:id/delete', controller.deleteUser);

module.exports = router;
