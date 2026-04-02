exports.createPage = (req, res) => {
  res.render('users/bookings/create');
};

exports.bookTaxiPage = (req, res) => {
  res.render('users/bookings/book-taxi');
};

exports.detailsPage = (req, res) => {
  res.render('users/bookings/details');
};

exports.submitBooking = (req, res) => {
  res.status(501).json({
    success: false,
    message: 'Booking form submission is not connected yet. Move this to backend API next.',
  });
};
