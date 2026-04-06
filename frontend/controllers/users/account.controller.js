const clientAuthApi = require('../../services/clientAuthApi');
const bookingsApi = require('../../services/bookingsApi');

function formatBookingStatus(status) {
  const value = String(status || 'pending').trim().toLowerCase();
  if (!value) {
    return 'Pending';
  }
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function formatBookingDate(booking) {
  const parts = [booking.requestedDateText, booking.rideTime].filter((item) => String(item || '').trim());
  if (parts.length) {
    return parts.join(' ').trim();
  }
  if (booking.rideDate) {
    const parsed = new Date(booking.rideDate);
    if (!Number.isNaN(parsed.getTime())) {
      return parsed.toLocaleString();
    }
  }
  return '—';
}

function mapBookingToTrip(booking) {
  return {
    id: booking.bookingCode || String(booking._id || ''),
    from: booking.pickupLocation || '',
    to: booking.destinationLocation || '',
    date: formatBookingDate(booking),
    status: formatBookingStatus(booking.status),
  };
}

function consumeFlash(req, key) {
  const message = req.session ? req.session[key] : null;
  if (req.session) {
    delete req.session[key];
  }
  return message;
}

function pathWithLocale(res, pathname) {
  const raw = pathname === undefined || pathname === null ? '/' : String(pathname).trim();
  const path = raw === '' ? '/' : (raw.startsWith('/') ? raw : `/${raw}`);
  const locale = res.locals && res.locals.locale ? String(res.locals.locale).toLowerCase() : 'nl';
  const loc = locale || 'nl';
  if (path === '/') {
    return `/${loc}`;
  }
  return `/${loc}${path}`;
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
    return res.redirect(pathWithLocale(res, '/account/register'));
  }

  try {
    const result = await clientAuthApi.registerClient({ fullName, email, password, phone });
    req.session.client = {
      token: result.token,
      user: result.user,
      createdAt: new Date().toISOString(),
    };
    return res.redirect(pathWithLocale(res, '/account'));
  } catch (error) {
    if (req.session) {
      req.session.clientAuthError = error.message || 'Registration failed.';
    }
    return res.redirect(pathWithLocale(res, '/account/register'));
  }
}

async function login(req, res) {
  const { email, password } = req.body;

  if (!email || !password) {
    if (req.session) {
      req.session.clientAuthError = 'Email and password are required.';
    }
    return res.redirect(pathWithLocale(res, '/account/login'));
  }

  try {
    const result = await clientAuthApi.loginClient({ email, password });
    req.session.client = {
      token: result.token,
      user: result.user,
      createdAt: new Date().toISOString(),
    };
    return res.redirect(pathWithLocale(res, '/account'));
  } catch (error) {
    if (req.session) {
      req.session.clientAuthError = error.message || 'Login failed.';
    }
    return res.redirect(pathWithLocale(res, '/account/login'));
  }
}

async function accountPage(req, res, next) {
  try {
    const user = req.session.client.user;
    const token = req.session.client.token;

    let recentBookings = [];
    let dashboardBookingsError = null;

    try {
      const bookings = await bookingsApi.listMyBookings(token);
      const list = Array.isArray(bookings) ? bookings : [];
      recentBookings = list.slice(0, 8).map(mapBookingToTrip);
    } catch (error) {
      dashboardBookingsError = error.message || 'Could not load your ride requests.';
    }

    return res.render('users/account/dashboard', {
      pageTitle: 'My Account',
      accountUser: user,
      recentBookings,
      dashboardBookingsError,
      activeAccountTab: 'account',
    });
  } catch (error) {
    return next(error);
  }
}

async function tripsPage(req, res, next) {
  const user = req.session.client.user;
  const token = req.session.client.token;

  let trips = [];
  let tripsError = null;

  try {
    const bookings = await bookingsApi.listMyBookings(token);
    const list = Array.isArray(bookings) ? bookings : [];
    trips = list.map(mapBookingToTrip);
  } catch (error) {
    tripsError = error.message || 'Could not load your trips.';
  }

  return res.render('users/account/trips', {
    pageTitle: 'My Trips',
    accountUser: user,
    trips,
    tripsError,
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
    return res.redirect(pathWithLocale(res, '/account/password'));
  }

  if (newPassword !== confirmPassword) {
    req.session.clientPasswordNotice = {
      type: 'error',
      message: 'New password and confirmation do not match.',
    };
    return res.redirect(pathWithLocale(res, '/account/password'));
  }

  req.session.clientPasswordNotice = {
    type: 'success',
    message: 'Password update UI is ready. Backend endpoint can be connected next.',
  };
  return res.redirect(pathWithLocale(res, '/account/password'));
}

function logout(req, res, next) {
  if (!req.session) {
    return res.redirect(pathWithLocale(res, '/account/login'));
  }

  req.session.client = null;
  return req.session.save((error) => {
    if (error) {
      return next(error);
    }

    return res.redirect(pathWithLocale(res, '/account/login'));
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
