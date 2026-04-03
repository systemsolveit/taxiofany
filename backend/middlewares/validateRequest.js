const { validationResult } = require('express-validator');

module.exports = function validateRequest(req, res, next) {
  const result = validationResult(req);

  if (result.isEmpty()) {
    return next();
  }

  const details = result.array().map((error) => ({
    field: error.path || error.param,
    message: error.msg,
    location: error.location,
  }));

  return res.status(400).json({
    success: false,
    error: {
      code: 'VALIDATION_ERROR',
      message: 'Request validation failed.',
      details,
    },
  });
};