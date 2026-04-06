const express = require('express');
const controller = require('../../controllers/users/profile.controller');
const { requireClientSession } = require('../../middleware/clientSessionAuth');

const router = express.Router();

router.get('/', requireClientSession, controller.profilePage);

module.exports = router;
