const { Schema, model } = require('mongoose');

function toSlug(value) {
  return String(value || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 120);
}

const packageSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, trim: true, lowercase: true, index: true },
    summary: { type: String, default: '', trim: true },
    priceLabel: { type: String, default: '', trim: true },
    features: { type: [String], default: [] },
    displayOrder: { type: Number, default: 0, min: 0 },
    isPublished: { type: Boolean, default: true },
  },
  { timestamps: true }
);

packageSchema.pre('validate', function preValidate(next) {
  if (!this.slug) {
    this.slug = toSlug(this.title);
  }
  if (!this.slug) {
    this.invalidate('slug', 'Slug is required.');
  }
  next();
});

packageSchema.index({ isPublished: 1, displayOrder: 1, createdAt: -1 });

module.exports = model('Package', packageSchema);
