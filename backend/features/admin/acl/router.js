const express = require('express');
const controller = require('./controller');
const { requireAdminAuth } = require('../auth/middleware');

const router = express.Router();

router.use(requireAdminAuth);

router.get('/roles', controller.roles);
router.get('/permissions', controller.permissions);
router.post('/check', controller.check);
router.get('/me', controller.myPermissions);

module.exports = router;
