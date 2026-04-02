exports.listPage = (req, res) => {
  res.render('admin/users/list', {
    pageTitle: 'Admin Users',
    activeSection: 'users',
    users: [
      { id: 1, name: 'Alaa Hassan', email: 'alaa@example.com', role: 'Customer', status: 'Active' },
      { id: 2, name: 'Nour Emad', email: 'nour@example.com', role: 'Driver', status: 'Pending' },
      { id: 3, name: 'Mina Samir', email: 'mina@example.com', role: 'Dispatcher', status: 'Suspended' },
    ],
  });
};

exports.detailsPage = (req, res) => {
  res.render('admin/users/details', {
    pageTitle: 'Admin User Details',
    activeSection: 'users',
    user: {
      id: req.params.id,
      name: 'Alaa Hassan',
      email: 'alaa@example.com',
      phone: '+20 100 000 0000',
      role: 'Customer',
      status: 'Active',
      joinedAt: '2026-01-15',
    },
  });
};
