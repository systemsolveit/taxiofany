const express = require('express');

const usersPublicRouter = require('./users/public.router');
const usersCompanyRouter = require('./users/company.router');
const usersBlogRouter = require('./users/blog.router');
const usersBookingsRouter = require('./users/bookings.router');
const usersContactRouter = require('./users/contact.router');
const usersDriversRouter = require('./users/drivers.router');
const usersProfileRouter = require('./users/profile.router');
const usersServicesRouter = require('./users/services.router');
const usersSupportRouter = require('./users/support.router');
const usersTaxiRouter = require('./users/taxi.router');
const usersErrorsRouter = require('./users/errors.router');
const adminDashboardRouter = require('./admin/dashboard.router');
const adminUsersRouter = require('./admin/users.router');
const adminBookingsRouter = require('./admin/bookings.router');

const router = express.Router();

router.use('/', usersPublicRouter);
router.use('/', usersCompanyRouter);
router.use('/', usersBlogRouter);
router.use('/', usersBookingsRouter);
router.use('/', usersContactRouter);
router.use('/', usersDriversRouter);
router.use('/profile', usersProfileRouter);
router.use('/', usersServicesRouter);
router.use('/', usersSupportRouter);
router.use('/', usersTaxiRouter);
router.use('/', usersErrorsRouter);

router.use('/admin', adminDashboardRouter);
router.use('/admin/users', adminUsersRouter);
router.use('/admin/bookings', adminBookingsRouter);

router.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'frontend' });
});

module.exports = router;
