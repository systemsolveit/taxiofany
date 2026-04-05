const { body } = require('express-validator');

const createSubmissionValidation = [
  body('firstName').optional().isString().trim(),
  body('lastName').optional().isString().trim(),
  body('firstname').optional().isString().trim(),
  body('lastname').optional().isString().trim(),
  body('fullName').optional().isString().trim(),
  body('email').isEmail().withMessage('email must be a valid email address.'),
  body('phone').optional().isString().trim(),
  body('subject').optional().isString().trim(),
  body('message').isString().trim().notEmpty().withMessage('message is required.'),
  body('sourcePage').optional().isString().trim(),
];

module.exports = {
  createSubmissionValidation,
};
