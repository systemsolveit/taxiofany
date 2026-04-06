const express = require('express');
const controller = require('./controller');
const validateRequest = require('../../../middlewares/validateRequest');
const { requireAdminAuth, requirePermission } = require('../auth/middleware');
const { PERMISSIONS } = require('../auth/permissionsCatalog');
const { bookingIdValidation, updateBookingValidation } = require('./validation');

const router = express.Router();

router.get('/', requireAdminAuth, requirePermission(PERMISSIONS.BOOKINGS_READ), controller.listBookings);
router.get(
  '/:id',
  requireAdminAuth,
  requirePermission(PERMISSIONS.BOOKINGS_READ),
  bookingIdValidation,
  validateRequest,
  controller.getBooking
);
router.patch(
  '/:id',
  requireAdminAuth,
  requirePermission(PERMISSIONS.BOOKINGS_UPDATE),
  updateBookingValidation,
  validateRequest,
  controller.updateBooking
);

module.exports = router;