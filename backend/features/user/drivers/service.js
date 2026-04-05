const { Driver } = require('../../../models');

async function listPublishedDrivers() {
  return Driver.find({ isPublished: true })
    .sort({ displayOrder: 1, createdAt: -1 })
    .lean();
}

async function getPublishedDriverBySlug(slug) {
  return Driver.findOne({ slug: String(slug || '').trim().toLowerCase(), isPublished: true }).lean();
}

module.exports = {
  listPublishedDrivers,
  getPublishedDriverBySlug,
};