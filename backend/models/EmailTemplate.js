const { Schema, model } = require('mongoose');

const emailTemplateSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    category: {
      type: String,
      trim: true,
      default: 'Transactional',
    },
    audience: {
      type: String,
      trim: true,
      default: 'Customers',
    },
    subject: {
      type: String,
      required: true,
      trim: true,
    },
    previewText: {
      type: String,
      trim: true,
      default: '',
    },
    summary: {
      type: String,
      trim: true,
      default: '',
    },
    heroTitle: {
      type: String,
      trim: true,
      default: '',
    },
    heroDescription: {
      type: String,
      trim: true,
      default: '',
    },
    bodyTitle: {
      type: String,
      trim: true,
      default: '',
    },
    bodyContent: {
      type: String,
      trim: true,
      default: '',
    },
    ctaLabel: {
      type: String,
      trim: true,
      default: '',
    },
    ctaUrl: {
      type: String,
      trim: true,
      default: '',
    },
    tone: {
      type: String,
      trim: true,
      default: 'Professional',
    },
    isPublished: {
      type: Boolean,
      default: true,
    },
    displayOrder: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = model('EmailTemplate', emailTemplateSchema);
