exports.dashboardPage = (req, res) => {
  res.render('admin/dashboard/index', {
    pageTitle: 'Admin Dashboard',
    activeSection: 'dashboard',
    stats: [
      { label: 'Active Bookings', value: 142, color: 'info', icon: 'fas fa-taxi' },
      { label: 'Registered Users', value: 1284, color: 'success', icon: 'fas fa-users' },
      { label: 'Available Drivers', value: 54, color: 'warning', icon: 'fas fa-id-badge' },
      { label: 'Open Support Issues', value: 9, color: 'danger', icon: 'fas fa-life-ring' },
    ],
    recentBookings: [
      { id: 'BK-1024', customer: 'Alaa Hassan', route: 'Airport to Maadi', status: 'Confirmed' },
      { id: 'BK-1025', customer: 'Nada Ali', route: 'Nasr City to Zamalek', status: 'Pending' },
      { id: 'BK-1026', customer: 'Omar Tarek', route: 'Heliopolis to New Cairo', status: 'Completed' },
    ],
  });
};
