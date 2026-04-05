const express = require('express');
const controller = require('./controller');
const validateRequest = require('../../../middlewares/validateRequest');
const { requireAdminAuth } = require('../auth/middleware');
const { bookingIdValidation, updateBookingValidation } = require('./validation');

const router = express.Router();

router.get('/', requireAdminAuth, controller.listBookings);
router.get('/:id', requireAdminAuth, bookingIdValidation, validateRequest, controller.getBooking);
router.patch('/:id', requireAdminAuth, updateBookingValidation, validateRequest, controller.updateBooking);

module.exports = router;