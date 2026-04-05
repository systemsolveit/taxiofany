const express = require('express');
const { body, param } = require('express-validator');
const controller = require('./controller');
const validateRequest = require('../../../middlewares/validateRequest');

const router = express.Router();

router.get('/', controller.listPosts);
router.get('/:slug', param('slug').isString().trim().notEmpty(), validateRequest, controller.getPost);
router.post(
	'/:slug/comments',
	[
		param('slug').isString().trim().notEmpty(),
		body('name').isString().trim().notEmpty().isLength({ max: 120 }),
		body('email').isEmail().normalizeEmail(),
		body('message').isString().trim().notEmpty().isLength({ max: 5000 }),
	],
	validateRequest,
	controller.submitComment
);

module.exports = router;