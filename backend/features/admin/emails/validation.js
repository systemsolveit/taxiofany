const { body, param } = require('express-validator');

const templateIdValidation = [
  param('id').isMongoId().withMessage('Invalid email template id.'),
];

const templateBodyValidation = [
  body('title').isString().trim().notEmpty().withMessage('Title is required.'),
  body('slug').optional().isString().trim().notEmpty().withMessage('Slug must be a non-empty string.'),
  body('category').optional().isString(),
  body('audience').optional().isString(),
  body('subject').isString().trim().notEmpty().withMessage('Subject is required.'),
  body('previewText').optional().isString(),
  body('summary').optional().isString(),
  body('heroTitle').optional().isString(),
  body('heroDescription').optional().isString(),
  body('bodyTitle').optional().isString(),
  body('bodyContent').optional().isString(),
  body('ctaLabel').optional().isString(),
  body('ctaUrl').optional().isString(),
  body('tone').optional().isString(),
  body('isPublished').optional().isBoolean().withMessage('isPublished must be a boolean.'),
  body('displayOrder').optional().isInt({ min: 0 }).withMessage('displayOrder must be a non-negative integer.'),
];

const createTemplateValidation = templateBodyValidation;
const updateTemplateValidation = [...templateIdValidation, ...templateBodyValidation];

module.exports = {
  templateIdValidation,
  createTemplateValidation,
  updateTemplateValidation,
};
