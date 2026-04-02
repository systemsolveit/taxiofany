const express = require('express');
const bookingsRouter = require('./bookings/router');

const router = express.Router();

router.use('/bookings', bookingsRouter);

module.exports = router;
