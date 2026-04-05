const { Service } = require('../../../models');

function parseStringList(value) {
  if (Array.isArray(value)) {
    return value.map((item) => String(item || '').trim()).filter(Boolean);
  }

  return String(value || '')
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
}

function parseJsonArray(value, fallback = []) {
  if (Array.isArray(value)) {
    return value;
  }

  const text = String(value || '').trim();
  if (!text) {
    return fallback;
  }

  try {
    const parsed = JSON.parse(text);
    return Array.isArray(parsed) ? parsed : fallback;
  } catch (error) {
    return fallback;
  }
}

function normalizeFeatures(value) {
  return parseJsonArray(value, [])
    .map((item) => ({
      iconClass: String(item && item.iconClass ? item.iconClass : 'las la-check').trim() || 'las la-check',
      title: String(item && item.title ? item.title : '').trim(),
      description: String(item && item.description ? item.description : '').trim(),
    }))
    .filter((item) => item.title || item.description);
}

function mapPayload(payload = {}) {
  return {
    title: payload.title,
    slug: payload.slug,
    shortDescription: payload.shortDescription,
    description: payload.description,
    category: payload.category,
    iconClass: payload.iconClass,
    coverImage: payload.coverImage,
    featureImage: payload.featureImage,
    benefitsImage: payload.benefitsImage,
    features: normalizeFeatures(payload.features),
    benefitPoints: parseStringList(payload.benefitPoints),
    tags: parseStringList(payload.tags),
    displayOrder: Number(payload.displayOrder) || 0,
    isPublished: payload.isPublished !== false,
  };
}

async function listServices() {
  return Service.find({}).sort({ displayOrder: 1, createdAt: -1 }).lean();
}

async function getServiceById(id) {
  return Service.findById(id).lean();
}

async function createService(payload = {}) {
  const doc = await Service.create(mapPayload(payload));
  return doc.toObject();
}

async function updateService(id, payload = {}) {
  const update = mapPayload(payload);
  Object.keys(update).forEach((key) => {
    if (update[key] === undefined) {
      delete update[key];
    }
  });
  return Service.findByIdAndUpdate(id, { $set: update }, { new: true }).lean();
}

async function deleteService(id) {
  return Service.findByIdAndDelete(id).lean();
}

module.exports = {
  listServices,
  getServiceById,
  createService,
  updateService,
  deleteService,
};
