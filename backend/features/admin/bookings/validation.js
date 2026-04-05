const { body, param } = require('express-validator');

const bookingIdValidation = [
  param('id').isMongoId().withMessage('id must be a valid MongoDB ObjectId.'),
];

const updateBookingValidation = [
  ...bookingIdValidation,
  body('status')
    .optional()
    .isIn(['pending', 'confirmed', 'completed', 'cancelled'])
    .withMessage('status must be pending, confirmed, completed, or cancelled.'),
  body('fareAmount').optional().isFloat({ min: 0 }).withMessage('fareAmount must be a non-negative number.'),
];

module.exports = {
  bookingIdValidation,
  updateBookingValidation,
};