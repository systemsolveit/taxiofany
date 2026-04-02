exports.indexPage = (req, res) => {
  res.render('users/contact/index');
};

exports.submitMessage = (req, res) => {
  res.status(501).json({
    success: false,
    message: 'Contact form submission is not connected yet. Move this to backend API next.',
  });
};
