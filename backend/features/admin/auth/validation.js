const { body } = require('express-validator');

const loginValidation = [
  body('email').isEmail().withMessage('email must be a valid email address.'),
  body('password').isString().notEmpty().withMessage('password is required.'),
];

const registerValidation = [
  body('fullName').isString().trim().notEmpty().withMessage('fullName is required.'),
  body('email').isEmail().withMessage('email must be a valid email address.'),
  body('password').isString().isLength({ min: 6 }).withMessage('password must be at least 6 characters.'),
  body('phone').optional().isString().withMessage('phone must be a string.'),
  body('role').optional().isString().withMessage('role must be a string.'),
];

module.exports = {
  loginValidation,
  registerValidation,
};