const { Car } = require('../../../models');

function mapPayload(payload = {}) {
  return {
    title: payload.title,
    slug: payload.slug,
    city: payload.city,
    image: payload.image,
    detailImage: payload.detailImage,
    pricePerKm: Number(payload.pricePerKm),
    initialCharge: Number(payload.initialCharge),
    perMileKm: Number(payload.perMileKm),
    perStoppedTraffic: Number(payload.perStoppedTraffic),
    passengers: Number(payload.passengers),
    transmission: payload.transmission,
    mileage: payload.mileage,
    engine: payload.engine,
    airCondition: payload.airCondition,
    luggageCarry: Number(payload.luggageCarry),
    description: payload.description,
    displayOrder: Number(payload.displayOrder) || 0,
    isPublished: payload.isPublished !== false,
  };
}

async function listCars() {
  return Car.find({}).sort({ displayOrder: 1, createdAt: -1 }).lean();
}

async function getCarById(id) {
  return Car.findById(id).lean();
}

async function createCar(payload = {}) {
  const doc = await Car.create(mapPayload(payload));
  return doc.toObject();
}

async function updateCar(id, payload = {}) {
  const update = mapPayload(payload);
  Object.keys(update).forEach((key) => {
    if (update[key] === undefined || Number.isNaN(update[key])) {
      delete update[key];
    }
  });
  return Car.findByIdAndUpdate(id, { $set: update }, { new: true }).lean();
}

async function deleteCar(id) {
  return Car.findByIdAndDelete(id).lean();
}

module.exports = {
  listCars,
  getCarById,
  createCar,
  updateCar,
  deleteCar,
};
