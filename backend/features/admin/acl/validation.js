const { body } = require('express-validator');

const checkAclValidation = [
  body('role')
    .isString()
    .trim()
    .notEmpty()
    .withMessage('role is required.')
    .isIn(['super_admin', 'admin', 'dispatcher', 'driver', 'customer'])
    .withMessage('role is invalid.'),
  body('permission').isString().trim().notEmpty().withMessage('permission is required.'),
];

module.exports = {
  checkAclValidation,
};