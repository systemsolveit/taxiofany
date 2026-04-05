const { Schema, model } = require('mongoose');

function toSlug(value) {
  return String(value || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 140);
}

const driverSchema = new Schema(
  {
    fullName: {
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
      index: true,
    },
    roleTitle: {
      type: String,
      default: 'Professional Driver',
      trim: true,
    },
    phone: {
      type: String,
      default: '',
      trim: true,
    },
    image: {
      type: String,
      default: '/assets/img/team-1.jpg',
      trim: true,
    },
    detailImage: {
      type: String,
      default: '/assets/img/team-details.jpg',
      trim: true,
    },
    carType: {
      type: String,
      default: '',
      trim: true,
    },
    plateNumber: {
      type: String,
      default: '',
      trim: true,
    },
    languages: {
      type: String,
      default: '',
      trim: true,
    },
    bio: {
      type: String,
      default: '',
      trim: true,
    },
    experienceYears: {
      type: Number,
      default: 5,
      min: 0,
    },
    displayOrder: {
      type: Number,
      default: 0,
      min: 0,
    },
    isPublished: {
      type: Boolean,
      default: true,
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

driverSchema.pre('validate', function preValidate(next) {
  if (!this.slug) {
    this.slug = toSlug(this.fullName);
  }

  if (!this.slug) {
    this.invalidate('slug', 'Slug is required.');
  }

  next();
});

module.exports = model('Driver', driverSchema);
