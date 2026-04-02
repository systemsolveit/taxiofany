module.exports = function errorHandler(err, req, res, next) {
  const statusCode = err.statusCode || 500;

  res.status(statusCode).json({
    success: false,
    error: {
      code: err.code || 'INTERNAL_SERVER_ERROR',
      message: err.message || 'An unexpected error occurred.',
    },
  });
};
