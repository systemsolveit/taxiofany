const express = require('express');
const controller = require('./controller');
const validateRequest = require('../../../middlewares/validateRequest');
const { requireClientAuth } = require('../auth/middleware');
const { createBookingValidation, bookingIdValidation } = require('./validation');

const router = express.Router();

/**
 * @openapi
 * /api/v1/user/bookings:
 *   get:
 *     tags: [Bookings]
 *     summary: List bookings
 *     responses:
 *       200:
 *         description: Bookings returned
 */
router.get('/', controller.listBookings);

/**
 * @openapi
 * /api/v1/user/bookings:
 *   post:
 *     tags: [Bookings]
 *     summary: Create booking
 *     responses:
 *       201:
 *         description: Booking created
 */
router.post('/', createBookingValidation, validateRequest, controller.createBooking);

/**
 * @openapi
 * /api/v1/user/bookings/mine:
 *   get:
 *     tags: [Bookings]
 *     summary: List bookings for the authenticated customer (matched by customer email)
 *     security:
 *       - bearerAuth: []
 */
router.get('/mine', requireClientAuth, controller.listMyBookings);

/**
 * @openapi
 * /api/v1/user/bookings/{id}:
 *   get:
 *     tags: [Bookings]
 *     summary: Get booking by id
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Booking returned
 */
router.get('/:id', bookingIdValidation, validateRequest, controller.getBooking);

module.exports = router;
