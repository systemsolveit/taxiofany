const { Schema, model } = require('mongoose');

const contactSubmissionSchema = new Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    phone: {
      type: String,
      trim: true,
      default: '',
    },
    subject: {
      type: String,
      trim: true,
      default: 'Contact Us Inquiry',
    },
    message: {
      type: String,
      required: true,
      trim: true,
    },
    sourcePage: {
      type: String,
      trim: true,
      default: '/contact',
    },
    status: {
      type: String,
      enum: ['new', 'in_progress', 'resolved'],
      default: 'new',
    },
    emailSent: {
      type: Boolean,
      default: false,
    },
    emailError: {
      type: String,
      trim: true,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = model('ContactSubmission', contactSubmissionSchema);
