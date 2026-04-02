const express = require('express');
const controller = require('../../controllers/users/blog.controller');

const router = express.Router();

router.get('/blog', controller.gridPage);
router.get('/blog/classic', controller.classicPage);
router.get('/blog/details', controller.detailsPage);

module.exports = router;
