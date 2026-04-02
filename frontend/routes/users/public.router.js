const express = require('express');
const controller = require('../../controllers/users/public.controller');

const router = express.Router();

router.get('/', controller.home);
router.get('/home/modern', controller.modernHome);
router.get('/packages', controller.packages);
router.get('/solutions', controller.solutions);

module.exports = router;
