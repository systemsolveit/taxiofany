const { Service } = require('../../../models');

async function listPublishedServices() {
  return Service.find({ isPublished: true })
    .sort({ displayOrder: 1, createdAt: -1 })
    .lean();
}

async function getPublishedServiceBySlug(slug) {
  return Service.findOne({
    slug: String(slug || '').trim().toLowerCase(),
    isPublished: true,
  }).lean();
}

module.exports = {
  listPublishedServices,
  getPublishedServiceBySlug,
};
