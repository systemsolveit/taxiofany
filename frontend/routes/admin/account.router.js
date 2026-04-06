const express = require('express');
const controller = require('../../controllers/admin/account.controller');

const router = express.Router();

router.get('/profile', controller.profilePage);
router.get('/password', controller.passwordPage);
router.post('/password', controller.updatePassword);

module.exports = router;
