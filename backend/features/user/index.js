const express = require('express');
const bookingsRouter = require('./bookings/router');
const authRouter = require('./auth/router');
const contactRouter = require('./contact/router');
const emailsRouter = require('./emails/router');
const i18nRouter = require('./i18n/router');
const blogRouter = require('./blog/router');
const servicesRouter = require('./services/router');
const carsRouter = require('./cars/router');
const driversRouter = require('./drivers/router');
const settingsRouter = require('./settings/router');
const contentRouter = require('./content/router');

const router = express.Router();

router.use('/auth', authRouter);
router.use('/i18n', i18nRouter);
router.use('/bookings', bookingsRouter);
router.use('/contact', contactRouter);
router.use('/emails', emailsRouter);
router.use('/blog', blogRouter);
router.use('/services', servicesRouter);
router.use('/cars', carsRouter);
router.use('/drivers', driversRouter);
router.use('/settings', settingsRouter);
router.use('/content', contentRouter);

module.exports = router;
