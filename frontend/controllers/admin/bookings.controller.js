const bookingsApi = require('../../services/adminBookingsApi');

function consumeNotice(req) {
  const notice = req.session ? req.session.bookingsNotice : null;
  if (req.session) {
    delete req.session.bookingsNotice;
  }
  return notice;
}

function setNotice(req, type, message) {
  if (req.session) {
    req.session.bookingsNotice = { type, message };
  }
}

function getAdminToken(req) {
  return req.session && req.session.admin ? req.session.admin.token : null;
}

function isAuthError(error) {
  return error && (error.statusCode === 401 || error.statusCode === 403);
}

function redirectToLogin(req, res, message) {
  if (req.session) {
    delete req.session.admin;
    req.session.authError = message || 'Your admin session expired. Please log in again.';
  }
  return res.redirect('/admin/login');
}

exports.listPage = async (req, res, next) => {
  const token = getAdminToken(req);
  if (!token) {
    return res.redirect('/admin/login');
  }

  try {
    const bookings = await bookingsApi.listBookings(token);
    return res.render('admin/bookings/list', {
      pageTitle: 'Admin Bookings',
      activeSection: 'bookings',
      bookings,
      notice: consumeNotice(req),
    });
  } catch (error) {
    if (isAuthError(error)) {
      return redirectToLogin(req, res);
    }
    return next(error);
  }
};

exports.detailsPage = async (req, res, next) => {
  const token = getAdminToken(req);
  if (!token) {
    return res.redirect('/admin/login');
  }

  try {
    const booking = await bookingsApi.getBooking(token, req.params.id);
    return res.render('admin/bookings/details', {
      pageTitle: 'Admin Booking Details',
      activeSection: 'bookings',
      booking,
      notice: consumeNotice(req),
    });
  } catch (error) {
    if (isAuthError(error)) {
      return redirectToLogin(req, res);
    }
    return next(error);
  }
};

exports.updateBooking = async (req, res) => {
  const token = getAdminToken(req);
  if (!token) {
    return res.redirect('/admin/login');
  }

  try {
    const updated = await bookingsApi.updateBooking(token, req.params.id, {
      status: String(req.body.status || '').trim().toLowerCase(),
      fareAmount: req.body.fareAmount === '' ? undefined : Number(req.body.fareAmount || 0),
    });
    setNotice(req, 'success', `Ride request ${updated.bookingCode} updated successfully.`);
  } catch (error) {
    if (isAuthError(error)) {
      return redirectToLogin(req, res);
    }
    setNotice(req, 'danger', `Update failed: ${error.message}`);
  }

  return res.redirect(`/admin/bookings/${encodeURIComponent(req.params.id)}`);
};
