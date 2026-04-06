const service = require('./service');

async function listBookings(req, res, next) {
  try {
    const bookings = await service.listBookings();
    res.json({ success: true, data: bookings });
  } catch (error) {
    next(error);
  }
}

async function createBooking(req, res, next) {
  try {
    const booking = await service.createBooking(req.body);
    res.status(201).json({ success: true, data: booking });
  } catch (error) {
    next(error);
  }
}

async function getBooking(req, res, next) {
  try {
    const booking = await service.getBookingById(req.params.id);
    if (!booking) {
      return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Booking not found.' } });
    }

    return res.json({ success: true, data: booking });
  } catch (error) {
    return next(error);
  }
}

async function listMyBookings(req, res, next) {
  try {
    const email = req.auth && req.auth.email;
    const bookings = await service.listBookingsForCustomerEmail(email);
    return res.json({ success: true, data: bookings });
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  listBookings,
  listMyBookings,
  createBooking,
  getBooking,
};
