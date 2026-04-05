const express = require('express');
const controller = require('../../controllers/users/blog.controller');

const router = express.Router();

router.get('/blog', controller.gridPage);
router.get('/blog/classic', controller.classicPage);
router.get('/blog/details/:slug', controller.detailsPage);
router.get('/blog/details', controller.detailsPage);
router.post('/blog/details/:slug/comment', controller.submitComment);

module.exports = router;
