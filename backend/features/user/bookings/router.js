const express = require('express');
const controller = require('./controller');

const router = express.Router();

router.get('/', controller.listBookings);
router.post('/', controller.createBooking);
router.get('/:id', controller.getBooking);

module.exports = router;
