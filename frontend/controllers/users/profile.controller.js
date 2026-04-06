exports.profilePage = (req, res) => {
  const user = req.session.client && req.session.client.user ? req.session.client.user : null;
  res.render('users/profile/index', {
    pageTitle: 'Profile',
    accountUser: user,
    portalSection: 'profile',
    message: null,
  });
};
