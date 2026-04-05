const express = require('express');

const publicRouter = require('./public.router');
const companyRouter = require('./company.router');
const blogRouter = require('./blog.router');
const bookingsRouter = require('./bookings.router');
const contactRouter = require('./contact.router');
const driversRouter = require('./drivers.router');
const emailsRouter = require('./emails.router');
const profileRouter = require('./profile.router');
const accountRouter = require('./account.router');
const servicesRouter = require('./services.router');
const supportRouter = require('./support.router');
const taxiRouter = require('./taxi.router');
const errorsRouter = require('./errors.router');

const router = express.Router();

router.use('/', publicRouter);
router.use('/', companyRouter);
router.use('/', blogRouter);
router.use('/', bookingsRouter);
router.use('/', contactRouter);
router.use('/', driversRouter);
router.use('/', emailsRouter);
router.use('/profile', profileRouter);
router.use('/', accountRouter);
router.use('/', servicesRouter);
router.use('/', supportRouter);
router.use('/', taxiRouter);
router.use('/', errorsRouter);

module.exports = router;
