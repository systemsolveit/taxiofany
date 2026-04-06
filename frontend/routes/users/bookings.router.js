const express = require('express');
const controller = require('../../controllers/users/bookings.controller');

const router = express.Router();

router.get('/book-taxi', controller.bookTaxiPage);
router.post('/book-taxi', controller.submitBooking);
router.get('/bookings/create', controller.createPage);
router.get('/bookings/submit', controller.redirectBookingsSubmitGet);
router.post('/bookings/submit', controller.submitBooking);
router.get('/bookings/:id', controller.detailsPage);

module.exports = router;
