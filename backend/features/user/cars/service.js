const { Car } = require('../../../models');

async function listPublishedCars() {
  return Car.find({ isPublished: true })
    .sort({ displayOrder: 1, createdAt: -1 })
    .lean();
}

async function getPublishedCarBySlug(slug) {
  return Car.findOne({ slug: String(slug || '').trim().toLowerCase(), isPublished: true }).lean();
}

module.exports = {
  listPublishedCars,
  getPublishedCarBySlug,
};
