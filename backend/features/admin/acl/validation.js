const { body, param } = require('express-validator');

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

const updateRoleValidation = [
  param('role')
    .isString()
    .trim()
    .notEmpty()
    .withMessage('role is required.')
    .isIn(['super_admin', 'admin', 'dispatcher', 'driver', 'customer'])
    .withMessage('role is invalid.'),
  body('permissions').isArray().withMessage('permissions must be an array.'),
  body('permissions.*').isString().trim().notEmpty().withMessage('each permission must be a non-empty string.'),
];

const roleParamValidation = [
  param('role')
    .isString()
    .trim()
    .notEmpty()
    .withMessage('role is required.')
    .isIn(['super_admin', 'admin', 'dispatcher', 'driver', 'customer'])
    .withMessage('role is invalid.'),
];

module.exports = {
  checkAclValidation,
  updateRoleValidation,
  roleParamValidation,
};