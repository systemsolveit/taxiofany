exports.profilePage = (req, res) => {
  res.render('users/profile/index', {
    pageTitle: 'Profile',
    message: 'User profile placeholder.',
  });
};
