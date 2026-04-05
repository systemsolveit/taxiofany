const express = require('express');

const authRouter = require('./auth.router');
const dashboardRouter = require('./dashboard.router');
const usersRouter = require('./users.router');
const bookingsRouter = require('./bookings.router');
const contactRouter = require('./contact.router');
const i18nRouter = require('./i18n.router');
const mediahubRouter = require('./mediahub.router');
const blogRouter = require('./blog.router');
const servicesRouter = require('./services.router');
const carsRouter = require('./cars.router');
const driversRouter = require('./drivers.router');
const emailsRouter = require('./emails.router');
const rolesRouter = require('./roles.router');
const settingsRouter = require('./settings.router');
const { requireAdminSession } = require('../../middleware/adminSessionAuth');

const router = express.Router();

router.use('/', authRouter);
router.use('/', requireAdminSession, dashboardRouter);
router.use('/users', requireAdminSession, usersRouter);
router.use('/bookings', requireAdminSession, bookingsRouter);
router.use('/contact', requireAdminSession, contactRouter);
router.use('/i18n', requireAdminSession, i18nRouter);
router.use('/mediahub', requireAdminSession, mediahubRouter);
router.use('/blog', requireAdminSession, blogRouter);
router.use('/services', requireAdminSession, servicesRouter);
router.use('/cars', requireAdminSession, carsRouter);
router.use('/drivers', requireAdminSession, driversRouter);
router.use('/emails', requireAdminSession, emailsRouter);
router.use('/roles', requireAdminSession, rolesRouter);
router.use('/settings', requireAdminSession, settingsRouter);

module.exports = router;
