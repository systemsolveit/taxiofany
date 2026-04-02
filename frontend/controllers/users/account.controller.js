const clientAuthApi = require('../../services/clientAuthApi');

function consumeFlash(req, key) {
  const message = req.session ? req.session[key] : null;
  if (req.session) {
    delete req.session[key];
  }
  return message;
}

function registerPage(req, res) {
  const errorMessage = req.session ? req.session.clientAuthError : null;
  if (req.session) {
    delete req.session.clientAuthError;
  }

  res.render('users/account/register', {
    pageTitle: 'Create Account',
    errorMessage,
  });
}

function loginPage(req, res) {
  const errorMessage = req.session ? req.session.clientAuthError : null;
  if (req.session) {
    delete req.session.clientAuthError;
  }

  res.render('users/account/login', {
    pageTitle: 'Login',
    errorMessage,
  });
}

async function register(req, res) {
  const { fullName, email, password, phone } = req.body;

  if (!fullName || !email || !password) {
    if (req.session) {
      req.session.clientAuthError = 'Name, email, and password are required.';
    }
    return res.redirect('/account/register');
  }

  try {
    const result = await clientAuthApi.registerClient({ fullName, email, password, phone });
    req.session.client = {
      token: result.token,
      user: result.user,
      createdAt: new Date().toISOString(),
    };
    return res.redirect('/account');
  } catch (error) {
    if (req.session) {
      req.session.clientAuthError = error.message || 'Registration failed.';
    }
    return res.redirect('/account/register');
  }
}

async function login(req, res) {
  const { email, password } = req.body;

  if (!email || !password) {
    if (req.session) {
      req.session.clientAuthError = 'Email and password are required.';
    }
    return res.redirect('/account/login');
  }

  try {
    const result = await clientAuthApi.loginClient({ email, password });
    req.session.client = {
      token: result.token,
      user: result.user,
      createdAt: new Date().toISOString(),
    };
    return res.redirect('/account');
  } catch (error) {
    if (req.session) {
      req.session.clientAuthError = error.message || 'Login failed.';
    }
    return res.redirect('/account/login');
  }
}

function accountPage(req, res) {
  res.render('users/account/dashboard', {
    pageTitle: 'My Account',
    accountUser: req.session.client.user,
    activeAccountTab: 'account',
  });
}

function tripsPage(req, res) {
  const user = req.session.client.user;
  const sampleTrips = [
    {
      id: 'TRIP-1001',
      from: 'Nasr City',
      to: 'Heliopolis',
      date: '2026-04-01 09:00',
      status: 'Completed',
    },
    {
      id: 'TRIP-1002',
      from: 'Dokki',
      to: 'Zamalek',
      date: '2026-04-02 14:30',
      status: 'Scheduled',
    },
  ];

  res.render('users/account/trips', {
    pageTitle: 'My Trips',
    accountUser: user,
    trips: sampleTrips,
    activeAccountTab: 'trips',
  });
}

function passwordPage(req, res) {
  const notice = consumeFlash(req, 'clientPasswordNotice');

  res.render('users/account/password', {
    pageTitle: 'Password Management',
    accountUser: req.session.client.user,
    activeAccountTab: 'password',
    notice,
  });
}

function updatePassword(req, res) {
  const { currentPassword, newPassword, confirmPassword } = req.body;

  if (!currentPassword || !newPassword || !confirmPassword) {
    req.session.clientPasswordNotice = {
      type: 'error',
      message: 'All password fields are required.',
    };
    return res.redirect('/account/password');
  }

  if (newPassword !== confirmPassword) {
    req.session.clientPasswordNotice = {
      type: 'error',
      message: 'New password and confirmation do not match.',
    };
    return res.redirect('/account/password');
  }

  req.session.clientPasswordNotice = {
    type: 'success',
    message: 'Password update UI is ready. Backend endpoint can be connected next.',
  };
  return res.redirect('/account/password');
}

function logout(req, res, next) {
  if (!req.session) {
    return res.redirect('/account/login');
  }

  req.session.client = null;
  return req.session.save((error) => {
    if (error) {
      return next(error);
    }

    return res.redirect('/account/login');
  });
}

module.exports = {
  registerPage,
  loginPage,
  register,
  login,
  accountPage,
  tripsPage,
  passwordPage,
  updatePassword,
  logout,
};
