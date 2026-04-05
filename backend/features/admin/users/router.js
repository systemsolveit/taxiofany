const express = require('express');
const controller = require('./controller');
const validateRequest = require('../../../middlewares/validateRequest');
const { userIdValidation, updateUserValidation, createUserValidation } = require('./validation');
const { requireAdminAuth } = require('../auth/middleware');

const router = express.Router();

router.get('/', requireAdminAuth, controller.listUsers);
router.post('/', requireAdminAuth, createUserValidation, validateRequest, controller.createUser);
router.get('/:id', requireAdminAuth, userIdValidation, validateRequest, controller.getUser);
router.patch('/:id', requireAdminAuth, updateUserValidation, validateRequest, controller.updateUser);
router.delete('/:id', requireAdminAuth, userIdValidation, validateRequest, controller.deleteUser);

module.exports = router;
