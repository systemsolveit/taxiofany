exports.listPage = (req, res) => {
  res.render('admin/bookings/list', {
    pageTitle: 'Admin Bookings',
    activeSection: 'bookings',
    bookings: [
      { id: 'BK-1024', customer: 'Alaa Hassan', pickup: 'Airport', destination: 'Maadi', status: 'Confirmed' },
      { id: 'BK-1025', customer: 'Nada Ali', pickup: 'Nasr City', destination: 'Zamalek', status: 'Pending' },
      { id: 'BK-1026', customer: 'Omar Tarek', pickup: 'Heliopolis', destination: 'New Cairo', status: 'Completed' },
    ],
  });
};

exports.detailsPage = (req, res) => {
  res.render('admin/bookings/details', {
    pageTitle: 'Admin Booking Details',
    activeSection: 'bookings',
    booking: {
      id: req.params.id,
      customer: 'Alaa Hassan',
      pickup: 'Airport',
      destination: 'Maadi',
      fare: 'EGP 320',
      paymentStatus: 'Paid',
      tripStatus: 'Confirmed',
    },
  });
};
