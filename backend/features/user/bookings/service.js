const { Booking } = require('../../../models');

async function generateBookingCode() {
  let bookingCode = '';
  let exists = true;

  while (exists) {
    bookingCode = `BK-${Date.now().toString().slice(-8)}${Math.floor(Math.random() * 10)}`;
    exists = await Booking.exists({ bookingCode });
  }

  return bookingCode;
}

async function listBookings() {
  return Booking.find().sort({ createdAt: -1 }).lean();
}

async function listBookingsForCustomerEmail(email) {
  const normalized = String(email || '').trim().toLowerCase();
  if (!normalized) {
    return [];
  }

  return Booking.find({ customerEmail: normalized }).sort({ createdAt: -1 }).lean();
}

function normalizePassengers(value) {
  const n = Math.floor(Number(value));
  if (!Number.isFinite(n) || n < 1) {
    return 1;
  }
  return Math.min(16, n);
}

async function createBooking(payload) {
  const bookingCode = await generateBookingCode();
  const booking = await Booking.create({
    bookingCode,
    customerName: payload.customerName,
    customerEmail: payload.customerEmail,
    packageType: payload.packageType,
    passengers: normalizePassengers(payload.passengers),
    pickupLocation: payload.pickupLocation,
    destinationLocation: payload.destinationLocation,
    rideDate: payload.rideDate,
    requestedDateText: payload.requestedDateText,
    rideTime: payload.rideTime,
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
  listBookingsForCustomerEmail,
  createBooking,
  getBookingById,
};
