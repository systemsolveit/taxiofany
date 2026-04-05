const { Driver } = require('../../../models');

function mapPayload(payload = {}) {
  return {
    fullName: payload.fullName,
    slug: payload.slug,
    roleTitle: payload.roleTitle,
    phone: payload.phone,
    image: payload.image,
    detailImage: payload.detailImage,
    carType: payload.carType,
    plateNumber: payload.plateNumber,
    languages: payload.languages,
    bio: payload.bio,
    experienceYears: Number(payload.experienceYears),
    displayOrder: Number(payload.displayOrder) || 0,
    isPublished: payload.isPublished !== false,
    availability: payload.availability,
  };
}

async function listDrivers() {
  return Driver.find({}).sort({ displayOrder: 1, createdAt: -1 }).lean();
}

async function getDriverById(id) {
  return Driver.findById(id).lean();
}

async function createDriver(payload = {}) {
  const doc = await Driver.create(mapPayload(payload));
  return doc.toObject();
}

async function updateDriver(id, payload = {}) {
  const update = mapPayload(payload);
  Object.keys(update).forEach((key) => {
    if (update[key] === undefined || Number.isNaN(update[key])) {
      delete update[key];
    }
  });
  return Driver.findByIdAndUpdate(id, { $set: update }, { new: true }).lean();
}

async function deleteDriver(id) {
  return Driver.findByIdAndDelete(id).lean();
}

module.exports = {
  listDrivers,
  getDriverById,
  createDriver,
  updateDriver,
  deleteDriver,
};