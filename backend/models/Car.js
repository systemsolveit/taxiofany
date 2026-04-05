const { Schema, model } = require('mongoose');

function toSlug(value) {
  return String(value || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 140);
}

const carSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, trim: true, lowercase: true, index: true },
    city: { type: String, default: '', trim: true },
    image: { type: String, default: '/assets/img/pricing-car.png', trim: true },
    detailImage: { type: String, default: '/assets/img/car-2.png', trim: true },
    pricePerKm: { type: Number, default: 2.5, min: 0 },
    initialCharge: { type: Number, default: 2.5, min: 0 },
    perMileKm: { type: Number, default: 4.2, min: 0 },
    perStoppedTraffic: { type: Number, default: 1.5, min: 0 },
    passengers: { type: Number, default: 4, min: 1 },
    transmission: { type: String, default: 'Auto', trim: true },
    mileage: { type: String, default: '170K', trim: true },
    engine: { type: String, default: '6.5L LP petrol', trim: true },
    airCondition: { type: Boolean, default: true },
    luggageCarry: { type: Number, default: 4, min: 0 },
    description: { type: String, default: '', trim: true },
    displayOrder: { type: Number, default: 0, min: 0 },
    isPublished: { type: Boolean, default: true },
  },
  { timestamps: true }
);

carSchema.pre('validate', function preValidate(next) {
  if (!this.slug) {
    this.slug = toSlug(this.title);
  }

  if (!this.slug) {
    this.invalidate('slug', 'Slug is required.');
  }

  next();
});

module.exports = model('Car', carSchema);
