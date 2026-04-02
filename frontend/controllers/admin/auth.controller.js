const authApi = require('../../services/adminAuthApi');

function loginPage(req, res) {
  const errorMessage = req.session ? req.session.authError : null;
  if (req.session) {
    delete req.session.authError;
  }

  res.render('admin/auth/login', {
    pageTitle: 'Admin Login',
    errorMessage,
  });
}

async function login(req, res) {
  const { email, password } = req.body;

  if (!email || !password) {
    if (req.session) {
      req.session.authError = 'Email and password are required.';
    }
    return res.redirect('/admin/login');
  }

  try {
    const result = await authApi.loginAdmin(email, password);

    req.session.admin = {
      token: result.token,
      user: result.user,
      createdAt: new Date().toISOString(),
    };

    return res.redirect('/admin');
  } catch (error) {
    if (req.session) {
      req.session.authError = error.message || 'Login failed.';
    }
    return res.redirect('/admin/login');
  }
}

function logout(req, res, next) {
  if (!req.session) {
    return res.redirect('/admin/login');
  }

  req.session.destroy((error) => {
    if (error) {
      return next(error);
    }

    res.clearCookie('taxiofany_admin_sid');
    return res.redirect('/admin/login');
  });
}

module.exports = {
  loginPage,
  login,
  logout,
};
