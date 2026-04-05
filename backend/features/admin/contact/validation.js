const { body, param } = require('express-validator');

const submissionIdValidation = [
  param('id').isMongoId().withMessage('Invalid contact submission id.'),
];

const updateSubmissionValidation = [
  ...submissionIdValidation,
  body('status')
    .isIn(['new', 'in_progress', 'resolved'])
    .withMessage('status must be new, in_progress, or resolved.'),
];

module.exports = {
  submissionIdValidation,
  updateSubmissionValidation,
};
