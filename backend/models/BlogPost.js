const { Schema, model } = require('mongoose');

function toSlug(value) {
  return String(value || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 140);
}

const blogPostSchema = new Schema(
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
    excerpt: {
      type: String,
      default: '',
      trim: true,
    },
    content: {
      type: String,
      default: '',
      trim: true,
    },
    contentSecondary: {
      type: String,
      default: '',
      trim: true,
    },
    quoteText: {
      type: String,
      default: '',
      trim: true,
    },
    quoteAuthor: {
      type: String,
      default: '',
      trim: true,
    },
    contentTertiary: {
      type: String,
      default: '',
      trim: true,
    },
    sectionHeading: {
      type: String,
      default: '',
      trim: true,
    },
    sectionParagraphOne: {
      type: String,
      default: '',
      trim: true,
    },
    sectionParagraphTwo: {
      type: String,
      default: '',
      trim: true,
    },
    galleryImages: {
      type: [String],
      default: [],
    },
    category: {
      type: String,
      default: 'General',
      trim: true,
    },
    authorName: {
      type: String,
      default: 'Admin',
      trim: true,
    },
    coverImage: {
      type: String,
      default: '/assets/img/post-1.jpg',
      trim: true,
    },
    authorAvatar: {
      type: String,
      default: '/assets/img/auhtor.png',
      trim: true,
    },
    authorBio: {
      type: String,
      default: '',
      trim: true,
    },
    authorSocialLinks: {
      type: [
        {
          icon: { type: String, default: 'lab la-facebook-f' },
          url: { type: String, default: '#' },
        },
      ],
      default: [],
    },
    comments: {
      type: [
        {
          name: { type: String, default: '' },
          email: { type: String, default: '' },
          dateLabel: { type: String, default: '' },
          avatar: { type: String, default: '' },
          message: { type: String, default: '' },
          approved: { type: Boolean, default: true },
          approvedAt: { type: Date, default: null },
          approvedBy: { type: String, default: '' },
          replies: {
            type: [
              {
                name: { type: String, default: '' },
                email: { type: String, default: '' },
                dateLabel: { type: String, default: '' },
                avatar: { type: String, default: '' },
                message: { type: String, default: '' },
                approved: { type: Boolean, default: true },
                approvedAt: { type: Date, default: null },
                approvedBy: { type: String, default: '' },
              },
            ],
            default: [],
          },
        },
      ],
      default: [],
    },
    tags: {
      type: [String],
      default: [],
    },
    isPublished: {
      type: Boolean,
      default: true,
    },
    publishedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

blogPostSchema.pre('validate', function preValidate(next) {
  if (!this.slug) {
    this.slug = toSlug(this.title);
  }

  if (!this.slug) {
    this.invalidate('slug', 'Slug is required.');
  }

  next();
});

module.exports = model('BlogPost', blogPostSchema);