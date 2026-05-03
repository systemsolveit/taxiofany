const { Schema, model } = require('mongoose');

const testimonialSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    role: { type: String, default: '', trim: true },
    company: { type: String, default: '', trim: true },
    quote: { type: String, required: true, trim: true },
    avatar: { type: String, default: '/assets/img/profile-avatar.svg', trim: true },
    rating: { type: Number, default: 5, min: 1, max: 5 },
    displayOrder: { type: Number, default: 0, min: 0 },
    isPublished: { type: Boolean, default: true },
  },
  { timestamps: true }
);

testimonialSchema.index({ isPublished: 1, displayOrder: 1, createdAt: -1 });

module.exports = model('Testimonial', testimonialSchema);
