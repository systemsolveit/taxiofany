const { param } = require('express-validator');

const userIdValidation = [
  param('id').isMongoId().withMessage('id must be a valid MongoDB ObjectId.'),
];

module.exports = {
  userIdValidation,
};