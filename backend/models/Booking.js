const { Schema, model } = require('mongoose');

const bookingSchema = new Schema(
  {
    bookingCode: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    customerName: {
      type: String,
      required: true,
      trim: true,
    },
    customerEmail: {
      type: String,
      trim: true,
      lowercase: true,
    },
    packageType: {
      type: String,
      trim: true,
    },
    passengers: {
      type: Number,
      min: 1,
      default: 1,
    },
    pickupLocation: {
      type: String,
      required: true,
      trim: true,
    },
    destinationLocation: {
      type: String,
      required: true,
      trim: true,
    },
    rideDate: {
      type: Date,
    },
    requestedDateText: {
      type: String,
      trim: true,
    },
    rideTime: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'completed', 'cancelled'],
      default: 'pending',
    },
    fareAmount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = model('Booking', bookingSchema);
