exports.home = (req, res) => {
  res.render('users/home/index');
};

exports.modernHome = (req, res) => {
  res.render('users/home/modern');
};

exports.packages = (req, res) => {
  res.render('users/packages/index', {
    pageTitle: 'Packages',
    message: 'Packages page placeholder.',
  });
};

exports.solutions = (req, res) => {
  res.render('users/solutions/index', {
    pageTitle: 'Solutions',
    message: 'Solutions page placeholder.',
  });
};
