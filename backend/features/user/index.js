const express = require('express');
const bookingsRouter = require('./bookings/router');
const authRouter = require('./auth/router');
const i18nRouter = require('./i18n/router');

const router = express.Router();

router.use('/auth', authRouter);
router.use('/i18n', i18nRouter);
router.use('/bookings', bookingsRouter);

module.exports = router;
