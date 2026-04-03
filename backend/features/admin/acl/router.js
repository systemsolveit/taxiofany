const express = require('express');
const controller = require('./controller');
const { requireAdminAuth } = require('../auth/middleware');
const validateRequest = require('../../../middlewares/validateRequest');
const { checkAclValidation } = require('./validation');

const router = express.Router();

router.use(requireAdminAuth);

router.get('/roles', controller.roles);
router.get('/permissions', controller.permissions);
router.post('/check', checkAclValidation, validateRequest, controller.check);
router.get('/me', controller.myPermissions);

module.exports = router;
