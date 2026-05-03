const { Testimonial, Package } = require('../../../models');

function normalizeDocument(document) {
  return document && typeof document.toObject === 'function' ? document.toObject() : document;
}

async function listPublishedTestimonials({ limit = 12 } = {}) {
  const n = Math.min(Math.max(Number(limit) || 12, 1), 50);
  const items = await Testimonial.find({ isPublished: true })
    .sort({ displayOrder: 1, createdAt: -1 })
    .limit(n)
    .lean();
  return items.map(normalizeDocument);
}

async function listPublishedPackages({ limit = 12 } = {}) {
  const n = Math.min(Math.max(Number(limit) || 12, 1), 50);
  const items = await Package.find({ isPublished: true })
    .sort({ displayOrder: 1, createdAt: -1 })
    .limit(n)
    .lean();
  return items.map(normalizeDocument);
}

module.exports = {
  listPublishedTestimonials,
  listPublishedPackages,
};
