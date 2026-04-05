const { body, param } = require('express-validator');

const userIdValidation = [
  param('id').isMongoId().withMessage('id must be a valid MongoDB ObjectId.'),
];

const updateUserValidation = [
  ...userIdValidation,
  body('fullName').optional().isString().trim().notEmpty().withMessage('fullName must be a non-empty string.'),
  body('phone').optional().isString(),
  body('role').optional().isIn(['customer', 'admin', 'super_admin', 'driver', 'dispatcher']).withMessage('Invalid role.'),
  body('status').optional().isIn(['active', 'pending', 'suspended']).withMessage('Invalid status.'),
];

const createUserValidation = [
  body('fullName').isString().trim().notEmpty().withMessage('fullName is required.'),
  body('email').isEmail().withMessage('email must be a valid email address.'),
  body('password').isString().isLength({ min: 6 }).withMessage('password must be at least 6 characters.'),
  body('phone').optional().isString(),
  body('role').optional().isIn(['customer', 'admin', 'super_admin', 'driver', 'dispatcher']).withMessage('Invalid role.'),
  body('status').optional().isIn(['active', 'pending', 'suspended']).withMessage('Invalid status.'),
];

module.exports = {
  userIdValidation,
  updateUserValidation,
  createUserValidation,
};