const express = require('express');
const controller = require('./controller');
const { requireAdminAuth } = require('../auth/middleware');
const validateRequest = require('../../../middlewares/validateRequest');
const { checkAclValidation, updateRoleValidation, roleParamValidation } = require('./validation');

const router = express.Router();

router.use(requireAdminAuth);

router.get('/roles', controller.roles);
router.get('/permissions', controller.permissions);
router.patch('/roles/:role', updateRoleValidation, validateRequest, controller.updateRolePermissions);
router.delete('/roles/:role', roleParamValidation, validateRequest, controller.resetRolePermissions);
router.post('/check', checkAclValidation, validateRequest, controller.check);
router.get('/me', controller.myPermissions);

module.exports = router;
