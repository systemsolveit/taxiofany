const bookingsApi = require('../../services/bookingsApi');

function combineRideDate(dateValue, timeValue) {
  const dateText = String(dateValue || '').trim();
  const timeText = String(timeValue || '').trim();
  if (!dateText) {
    return null;
  }

  const direct = new Date(timeText ? `${dateText} ${timeText}` : dateText);
  if (!Number.isNaN(direct.getTime())) {
    return direct.toISOString();
  }

  const dateParts = dateText.match(/^(\d{1,2})[\/.-](\d{1,2})[\/.-](\d{4})$/);
  if (dateParts) {
    const month = Number(dateParts[1]) - 1;
    const day = Number(dateParts[2]);
    const year = Number(dateParts[3]);
    const parsed = new Date(Date.UTC(year, month, day));
    if (!Number.isNaN(parsed.getTime())) {
      return parsed.toISOString();
    }
  }

  return null;
}

exports.createPage = (req, res) => {
  res.render('users/bookings/create');
};

exports.bookTaxiPage = (req, res) => {
  res.render('users/bookings/book-taxi');
};

exports.detailsPage = async (req, res, next) => {
  try {
    const booking = await bookingsApi.getBooking(req.params.id);
    return res.render('users/bookings/details', {
      booking,
      message: null,
    });
  } catch (error) {
    return next(error);
  }
};

exports.submitBooking = async (req, res) => {
  try {
    const requestedDateText = String(req.body['ride-date'] || '').trim();
    const rideTime = String(req.body['ride-time'] || '').trim();
    const booking = await bookingsApi.createBooking({
      customerName: String(req.body['full-name'] || '').trim(),
      customerEmail: String(req.body.email || '').trim().toLowerCase(),
      packageType: String(req.body['package-type'] || '').trim(),
      passengers: Number(req.body.passengers || 1),
      pickupLocation: String(req.body['start-dest'] || '').trim(),
      destinationLocation: String(req.body['end-dest'] || '').trim(),
      rideDate: combineRideDate(requestedDateText, rideTime),
      requestedDateText,
      rideTime,
      status: 'pending',
    });

    return res.send(`Ride request submitted successfully. Reference: ${booking.bookingCode}`);
  } catch (error) {
    return res.status(error.statusCode || 500).send(error.message || 'Booking request failed.');
  }
};
