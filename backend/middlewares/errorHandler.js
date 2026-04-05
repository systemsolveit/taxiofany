const { logger } = require('./logger');

module.exports = function errorHandler(err, req, res, next) {
  const statusCode = err.statusCode || 500;

  logger.error(err.message || 'Unhandled application error.', {
    code: err.code || 'INTERNAL_SERVER_ERROR',
    statusCode,
    path: req && req.originalUrl,
    method: req && req.method,
    stack: err.stack,
  });

  res.status(statusCode).json({
    success: false,
    error: {
      code: err.code || 'INTERNAL_SERVER_ERROR',
      message: err.message || 'An unexpected error occurred.',
    },
  });
};
