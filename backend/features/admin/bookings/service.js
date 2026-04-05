const { Booking } = require('../../../models');

async function listBookings() {
  return Booking.find().sort({ createdAt: -1 }).lean();
}

async function getBookingById(id) {
  return Booking.findById(id).lean();
}

async function updateBookingById(id, payload = {}) {
  const update = {
    status: payload.status,
    fareAmount: payload.fareAmount,
  };

  Object.keys(update).forEach((key) => {
    if (update[key] === undefined) {
      delete update[key];
    }
  });

  return Booking.findByIdAndUpdate(id, { $set: update }, { new: true }).lean();
}

module.exports = {
  listBookings,
  getBookingById,
  updateBookingById,
};