const adminBookingsApi = require('../../services/adminBookingsApi');

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

exports.dashboardPage = async (req, res, next) => {
  const token = getAdminToken(req);
  if (!token) {
    return res.redirect('/admin/login');
  }

  try {
    const bookings = await adminBookingsApi.listBookings(token);
    const stats = [
      { label: 'Total Ride Requests', value: bookings.length, color: 'primary', icon: 'fas fa-taxi' },
      { label: 'Pending Dispatch', value: bookings.filter((item) => item.status === 'pending').length, color: 'warning', icon: 'fas fa-hourglass-half' },
      { label: 'Confirmed Rides', value: bookings.filter((item) => item.status === 'confirmed').length, color: 'info', icon: 'fas fa-circle-check' },
      { label: 'Completed Trips', value: bookings.filter((item) => item.status === 'completed').length, color: 'success', icon: 'fas fa-flag-checkered' },
    ];

    const recentBookings = bookings.slice(0, 6).map((booking) => ({
      id: booking._id,
      bookingCode: booking.bookingCode,
      customer: booking.customerName,
      route: `${booking.pickupLocation} to ${booking.destinationLocation}`,
      status: booking.status,
      requestedDateText: booking.requestedDateText,
      rideTime: booking.rideTime,
    }));

    return res.render('admin/dashboard/index', {
      pageTitle: 'Admin Dashboard',
      activeSection: 'dashboard',
      stats,
      recentBookings,
    });
  } catch (error) {
    if (isAuthError(error)) {
      return redirectToLogin(req, res);
    }
    return next(error);
  }
};
