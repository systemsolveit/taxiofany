const { Schema, model } = require('mongoose');

const driverSchema = new Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    phone: {
      type: String,
      trim: true,
    },
    carType: {
      type: String,
      trim: true,
    },
    plateNumber: {
      type: String,
      trim: true,
    },
    availability: {
      type: String,
      enum: ['available', 'busy', 'offline'],
      default: 'available',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = model('Driver', driverSchema);
