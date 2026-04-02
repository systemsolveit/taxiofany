const express = require('express');

const authRouter = require('./auth.router');
const dashboardRouter = require('./dashboard.router');
const usersRouter = require('./users.router');
const bookingsRouter = require('./bookings.router');
const { requireAdminSession } = require('../../middleware/adminSessionAuth');

const router = express.Router();

router.use('/', authRouter);
router.use('/', requireAdminSession, dashboardRouter);
router.use('/users', requireAdminSession, usersRouter);
router.use('/bookings', requireAdminSession, bookingsRouter);

module.exports = router;
