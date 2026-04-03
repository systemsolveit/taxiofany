const express = require('express');
const controller = require('./controller');
const validateRequest = require('../../../middlewares/validateRequest');
const { userIdValidation } = require('./validation');

const router = express.Router();

router.get('/', controller.listUsers);
router.get('/:id', userIdValidation, validateRequest, controller.getUser);

module.exports = router;
