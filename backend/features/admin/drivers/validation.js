const { body, param } = require('express-validator');

const driverIdValidation = [
  param('id').isMongoId().withMessage('Invalid driver id.'),
];

const createDriverValidation = [
  body('fullName').isString().trim().notEmpty().withMessage('Full name is required.'),
  body('slug').optional({ nullable: true, checkFalsy: true }).isString().trim(),
  body('roleTitle').optional().isString().trim(),
  body('phone').optional().isString().trim(),
  body('image').optional().isString().trim(),
  body('detailImage').optional().isString().trim(),
  body('carType').optional().isString().trim(),
  body('plateNumber').optional().isString().trim(),
  body('languages').optional().isString().trim(),
  body('bio').optional().isString().trim(),
  body('experienceYears').optional().isInt({ min: 0 }),
  body('displayOrder').optional().isInt({ min: 0 }),
  body('isPublished').optional().isBoolean(),
  body('availability').optional().isIn(['available', 'busy', 'offline']).withMessage('Invalid availability.'),
];

const updateDriverValidation = [
  ...driverIdValidation,
  body('fullName').optional().isString().trim().notEmpty(),
  body('slug').optional({ nullable: true, checkFalsy: true }).isString().trim(),
  body('roleTitle').optional().isString().trim(),
  body('phone').optional().isString().trim(),
  body('image').optional().isString().trim(),
  body('detailImage').optional().isString().trim(),
  body('carType').optional().isString().trim(),
  body('plateNumber').optional().isString().trim(),
  body('languages').optional().isString().trim(),
  body('bio').optional().isString().trim(),
  body('experienceYears').optional().isInt({ min: 0 }),
  body('displayOrder').optional().isInt({ min: 0 }),
  body('isPublished').optional().isBoolean(),
  body('availability').optional().isIn(['available', 'busy', 'offline']).withMessage('Invalid availability.'),
];

module.exports = {
  driverIdValidation,
  createDriverValidation,
  updateDriverValidation,
};