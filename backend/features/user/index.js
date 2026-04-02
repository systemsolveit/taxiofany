const express = require('express');
const bookingsRouter = require('./bookings/router');
const authRouter = require('./auth/router');

const router = express.Router();

router.use('/auth', authRouter);
router.use('/bookings', bookingsRouter);

module.exports = router;
