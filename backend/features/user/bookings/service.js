const { Booking } = require('../../../models');

async function listBookings() {
  return Booking.find().sort({ createdAt: -1 }).lean();
}

async function createBooking(payload) {
  const count = await Booking.countDocuments();
  const booking = await Booking.create({
    bookingCode: `BK-${1000 + count + 1}`,
    customerName: payload.customerName,
    customerEmail: payload.customerEmail,
    pickupLocation: payload.pickupLocation,
    destinationLocation: payload.destinationLocation,
    rideDate: payload.rideDate,
    status: payload.status || 'pending',
    fareAmount: payload.fareAmount || 0,
  });

  return booking.toObject();
}

async function getBookingById(id) {
  return Booking.findById(id).lean();
}

module.exports = {
  listBookings,
  createBooking,
  getBookingById,
};
