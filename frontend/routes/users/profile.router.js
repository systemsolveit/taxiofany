const express = require('express');
const controller = require('../../controllers/users/profile.controller');

const router = express.Router();

router.get('/', controller.profilePage);

module.exports = router;
