const { Schema, model } = require('mongoose');

function toSlug(value) {
  return String(value || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 140);
}

const serviceSchema = new Schema(
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
      index: true,
    },
    shortDescription: {
      type: String,
      default: '',
      trim: true,
    },
    description: {
      type: String,
      default: '',
      trim: true,
    },
    category: {
      type: String,
      default: 'General',
      trim: true,
    },
    iconClass: {
      type: String,
      default: 'las la-taxi',
      trim: true,
    },
    coverImage: {
      type: String,
      default: '/assets/img/service-1.jpg',
      trim: true,
    },
    featureImage: {
      type: String,
      default: '/assets/img/post-2.jpg',
      trim: true,
    },
    benefitsImage: {
      type: String,
      default: '/assets/img/post-1.jpg',
      trim: true,
    },
    serviceCarImage: {
      type: String,
      default: '/assets/img/car-1.png',
      trim: true,
    },
    features: {
      type: [
        {
          iconClass: { type: String, default: 'las la-check' },
          title: { type: String, default: '' },
          description: { type: String, default: '' },
        },
      ],
      default: [],
    },
    benefitPoints: {
      type: [String],
      default: [],
    },
    tags: {
      type: [String],
      default: [],
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
  },
  {
    timestamps: true,
  }
);

serviceSchema.pre('validate', function preValidate(next) {
  if (!this.slug) {
    this.slug = toSlug(this.title);
  }

  if (!this.slug) {
    this.invalidate('slug', 'Slug is required.');
  }

  next();
});

module.exports = model('Service', serviceSchema);
