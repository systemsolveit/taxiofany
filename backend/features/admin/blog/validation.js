const { body, param } = require('express-validator');

const postIdValidation = [
  param('id').isMongoId().withMessage('Invalid blog post id.'),
];

const createPostValidation = [
  body('title').isString().trim().notEmpty().withMessage('Title is required.'),
  body('slug').optional({ nullable: true, checkFalsy: true }).isString().trim(),
  body('excerpt').optional().isString(),
  body('content').optional().isString(),
  body('contentSecondary').optional().isString(),
  body('quoteText').optional().isString(),
  body('quoteAuthor').optional().isString(),
  body('contentTertiary').optional().isString(),
  body('sectionHeading').optional().isString(),
  body('sectionParagraphOne').optional().isString(),
  body('sectionParagraphTwo').optional().isString(),
  body('galleryImages').optional(),
  body('category').optional().isString(),
  body('authorName').optional().isString(),
  body('coverImage').optional().isString(),
  body('authorAvatar').optional().isString(),
  body('authorBio').optional().isString(),
  body('authorSocialLinks').optional(),
  body('comments').optional(),
  body('tags').optional(),
  body('isPublished').optional().isBoolean(),
  body('publishedAt').optional().isISO8601().withMessage('publishedAt must be a valid date.'),
];

const updatePostValidation = [
  ...postIdValidation,
  body('title').optional().isString().trim().notEmpty(),
  body('slug').optional({ nullable: true, checkFalsy: true }).isString().trim(),
  body('excerpt').optional().isString(),
  body('content').optional().isString(),
  body('contentSecondary').optional().isString(),
  body('quoteText').optional().isString(),
  body('quoteAuthor').optional().isString(),
  body('contentTertiary').optional().isString(),
  body('sectionHeading').optional().isString(),
  body('sectionParagraphOne').optional().isString(),
  body('sectionParagraphTwo').optional().isString(),
  body('galleryImages').optional(),
  body('category').optional().isString(),
  body('authorName').optional().isString(),
  body('coverImage').optional().isString(),
  body('authorAvatar').optional().isString(),
  body('authorBio').optional().isString(),
  body('authorSocialLinks').optional(),
  body('comments').optional(),
  body('tags').optional(),
  body('isPublished').optional().isBoolean(),
  body('publishedAt').optional().isISO8601().withMessage('publishedAt must be a valid date.'),
];

module.exports = {
  postIdValidation,
  createPostValidation,
  updatePostValidation,
};