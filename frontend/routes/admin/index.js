const express = require('express');

const authRouter = require('./auth.router');
const dashboardRouter = require('./dashboard.router');
const usersRouter = require('./users.router');
const bookingsRouter = require('./bookings.router');
const i18nRouter = require('./i18n.router');
const { requireAdminSession } = require('../../middleware/adminSessionAuth');

const router = express.Router();

router.use('/', authRouter);
router.use('/', requireAdminSession, dashboardRouter);
router.use('/users', requireAdminSession, usersRouter);
router.use('/bookings', requireAdminSession, bookingsRouter);
router.use('/i18n', requireAdminSession, i18nRouter);

module.exports = router;
