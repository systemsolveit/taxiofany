const { body, param } = require('express-validator');

const createBookingValidation = [
  body('customerName').isString().trim().notEmpty().withMessage('customerName is required.'),
  body('customerEmail').optional().isEmail().withMessage('customerEmail must be a valid email address.'),
  body('packageType').optional().isString().trim().notEmpty().withMessage('packageType must be a non-empty string.'),
  body('passengers')
    .optional()
    .isInt({ min: 1, max: 16 })
    .withMessage('passengers must be an integer between 1 and 16.'),
  body('pickupLocation').isString().trim().notEmpty().withMessage('pickupLocation is required.'),
  body('destinationLocation').isString().trim().notEmpty().withMessage('destinationLocation is required.'),
  body('rideDate').optional().isISO8601().withMessage('rideDate must be a valid ISO date.'),
  body('requestedDateText').optional().isString().trim().notEmpty().withMessage('requestedDateText must be a non-empty string.'),
  body('rideTime').optional().isString().trim().notEmpty().withMessage('rideTime must be a non-empty string.'),
  body('status')
    .optional()
    .isIn(['pending', 'confirmed', 'completed', 'cancelled'])
    .withMessage('status must be pending, confirmed, completed, or cancelled.'),
  body('fareAmount').optional().isFloat({ min: 0 }).withMessage('fareAmount must be a non-negative number.'),
];

const bookingIdValidation = [
  param('id').isMongoId().withMessage('id must be a valid MongoDB ObjectId.'),
];

module.exports = {
  createBookingValidation,
  bookingIdValidation,
};