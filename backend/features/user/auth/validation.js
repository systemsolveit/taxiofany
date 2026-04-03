const { body } = require('express-validator');

const registerValidation = [
  body('fullName').isString().trim().notEmpty().withMessage('fullName is required.'),
  body('email').isEmail().withMessage('email must be a valid email address.'),
  body('password').isString().isLength({ min: 6 }).withMessage('password must be at least 6 characters.'),
  body('phone').optional().isString().withMessage('phone must be a string.'),
];

const loginValidation = [
  body('email').isEmail().withMessage('email must be a valid email address.'),
  body('password').isString().notEmpty().withMessage('password is required.'),
];

module.exports = {
  registerValidation,
  loginValidation,
};