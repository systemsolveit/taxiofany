const express = require('express');
const controller = require('./controller');
const validateRequest = require('../../../middlewares/validateRequest');
const { requireAdminAuth, requirePermission } = require('../auth/middleware');
const { PERMISSIONS } = require('../auth/permissionsCatalog');
const { postIdValidation, createPostValidation, updatePostValidation } = require('./validation');

const router = express.Router();

router.get('/', requireAdminAuth, requirePermission(PERMISSIONS.BLOG_READ), controller.listPosts);
router.get('/:id', requireAdminAuth, requirePermission(PERMISSIONS.BLOG_READ), postIdValidation, validateRequest, controller.getPost);
router.post('/', requireAdminAuth, requirePermission(PERMISSIONS.BLOG_WRITE), createPostValidation, validateRequest, controller.createPost);
router.patch('/:id', requireAdminAuth, requirePermission(PERMISSIONS.BLOG_WRITE), updatePostValidation, validateRequest, controller.updatePost);
router.delete('/:id', requireAdminAuth, requirePermission(PERMISSIONS.BLOG_WRITE), postIdValidation, validateRequest, controller.deletePost);

module.exports = router;