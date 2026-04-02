exports.notFoundPage = (req, res) => {
  res.status(404).render('users/errors/not-found');
};
