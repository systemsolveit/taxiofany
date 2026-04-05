const express = require('express');
const controller = require('./controller');
const validateRequest = require('../../../middlewares/validateRequest');
const { requireAdminAuth } = require('../auth/middleware');
const { postIdValidation, createPostValidation, updatePostValidation } = require('./validation');

const router = express.Router();

router.get('/', requireAdminAuth, controller.listPosts);
router.get('/:id', requireAdminAuth, postIdValidation, validateRequest, controller.getPost);
router.post('/', requireAdminAuth, createPostValidation, validateRequest, controller.createPost);
router.patch('/:id', requireAdminAuth, updatePostValidation, validateRequest, controller.updatePost);
router.delete('/:id', requireAdminAuth, postIdValidation, validateRequest, controller.deletePost);

module.exports = router;