module.exports = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Unexpected server error.';

  if (res.headersSent) {
    return next(err);
  }

  return res.status(statusCode).render('users/home/index', {
    pageTitle: 'Server Error',
    message,
  });
};
