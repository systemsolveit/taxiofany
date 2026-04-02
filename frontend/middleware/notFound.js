module.exports = (req, res) => {
  res.status(404).render('users/errors/not-found');
};
