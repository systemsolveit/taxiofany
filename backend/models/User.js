const { Schema, model } = require('mongoose');

const userSchema = new Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    phone: {
      type: String,
      trim: true,
    },
    role: {
      type: String,
      enum: ['customer', 'admin', 'driver', 'dispatcher'],
      default: 'customer',
    },
    status: {
      type: String,
      enum: ['active', 'pending', 'suspended'],
      default: 'active',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = model('User', userSchema);
