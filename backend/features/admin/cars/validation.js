const { body, param } = require('express-validator');

const carIdValidation = [
  param('id').isMongoId().withMessage('Invalid car id.'),
];

const createCarValidation = [
  body('title').isString().trim().notEmpty().withMessage('Title is required.'),
  body('slug').optional({ nullable: true, checkFalsy: true }).isString().trim(),
  body('city').optional().isString(),
  body('image').optional().isString(),
  body('detailImage').optional().isString(),
  body('pricePerKm').optional().isFloat({ min: 0 }),
  body('initialCharge').optional().isFloat({ min: 0 }),
  body('perMileKm').optional().isFloat({ min: 0 }),
  body('perStoppedTraffic').optional().isFloat({ min: 0 }),
  body('passengers').optional().isInt({ min: 1 }),
  body('transmission').optional().isString(),
  body('mileage').optional().isString(),
  body('engine').optional().isString(),
  body('airCondition').optional().isBoolean(),
  body('luggageCarry').optional().isInt({ min: 0 }),
  body('description').optional().isString(),
  body('displayOrder').optional().isInt({ min: 0 }),
  body('isPublished').optional().isBoolean(),
];

const updateCarValidation = [
  ...carIdValidation,
  body('title').optional().isString().trim().notEmpty(),
  body('slug').optional({ nullable: true, checkFalsy: true }).isString().trim(),
  body('city').optional().isString(),
  body('image').optional().isString(),
  body('detailImage').optional().isString(),
  body('pricePerKm').optional().isFloat({ min: 0 }),
  body('initialCharge').optional().isFloat({ min: 0 }),
  body('perMileKm').optional().isFloat({ min: 0 }),
  body('perStoppedTraffic').optional().isFloat({ min: 0 }),
  body('passengers').optional().isInt({ min: 1 }),
  body('transmission').optional().isString(),
  body('mileage').optional().isString(),
  body('engine').optional().isString(),
  body('airCondition').optional().isBoolean(),
  body('luggageCarry').optional().isInt({ min: 0 }),
  body('description').optional().isString(),
  body('displayOrder').optional().isInt({ min: 0 }),
  body('isPublished').optional().isBoolean(),
];

module.exports = {
  carIdValidation,
  createCarValidation,
  updateCarValidation,
};
