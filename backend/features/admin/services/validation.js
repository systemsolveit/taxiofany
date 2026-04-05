const { body, param } = require('express-validator');

const serviceIdValidation = [
  param('id').isMongoId().withMessage('Invalid service id.'),
];

const createServiceValidation = [
  body('title').isString().trim().notEmpty().withMessage('Title is required.'),
  body('slug').optional({ nullable: true, checkFalsy: true }).isString().trim(),
  body('shortDescription').optional().isString(),
  body('description').optional().isString(),
  body('category').optional().isString(),
  body('iconClass').optional().isString(),
  body('coverImage').optional().isString(),
  body('featureImage').optional().isString(),
  body('benefitsImage').optional().isString(),
  body('features').optional(),
  body('benefitPoints').optional(),
  body('tags').optional(),
  body('displayOrder').optional().isInt({ min: 0 }),
  body('isPublished').optional().isBoolean(),
];

const updateServiceValidation = [
  ...serviceIdValidation,
  body('title').optional().isString().trim().notEmpty(),
  body('slug').optional({ nullable: true, checkFalsy: true }).isString().trim(),
  body('shortDescription').optional().isString(),
  body('description').optional().isString(),
  body('category').optional().isString(),
  body('iconClass').optional().isString(),
  body('coverImage').optional().isString(),
  body('featureImage').optional().isString(),
  body('benefitsImage').optional().isString(),
  body('features').optional(),
  body('benefitPoints').optional(),
  body('tags').optional(),
  body('displayOrder').optional().isInt({ min: 0 }),
  body('isPublished').optional().isBoolean(),
];

module.exports = {
  serviceIdValidation,
  createServiceValidation,
  updateServiceValidation,
};
