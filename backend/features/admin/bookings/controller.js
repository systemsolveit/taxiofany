const service = require('./service');

async function listBookings(req, res, next) {
  try {
    const bookings = await service.listBookings();
    return res.json({ success: true, data: bookings });
  } catch (error) {
    return next(error);
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

async function updateBooking(req, res, next) {
  try {
    const booking = await service.updateBookingById(req.params.id, {
      status: req.body.status,
      fareAmount: req.body.fareAmount,
    });

    if (!booking) {
      return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Booking not found.' } });
    }

    return res.json({ success: true, data: booking });
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  listBookings,
  getBooking,
  updateBooking,
};