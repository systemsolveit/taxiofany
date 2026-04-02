const express = require('express');
const controller = require('../../controllers/users/bookings.controller');

const router = express.Router();

router.get('/book-taxi', controller.bookTaxiPage);
router.get('/bookings/create', controller.createPage);
router.post('/bookings/submit', controller.submitBooking);
router.get('/bookings/:id', controller.detailsPage);

module.exports = router;
