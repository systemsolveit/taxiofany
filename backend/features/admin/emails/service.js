const { EmailTemplate } = require('../../../models');

function normalizeSlug(value = '') {
  return String(value || '')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '') || 'email-template';
}

function mapPayload(payload = {}) {
  return {
    title: String(payload.title || '').trim(),
    slug: normalizeSlug(payload.slug || payload.title),
    category: String(payload.category || '').trim(),
    audience: String(payload.audience || '').trim(),
    subject: String(payload.subject || '').trim(),
    previewText: String(payload.previewText || '').trim(),
    summary: String(payload.summary || '').trim(),
    heroTitle: String(payload.heroTitle || '').trim(),
    heroDescription: String(payload.heroDescription || '').trim(),
    bodyTitle: String(payload.bodyTitle || '').trim(),
    bodyContent: String(payload.bodyContent || '').trim(),
    ctaLabel: String(payload.ctaLabel || '').trim(),
    ctaUrl: String(payload.ctaUrl || '').trim(),
    tone: String(payload.tone || '').trim(),
    isPublished: Boolean(payload.isPublished),
    displayOrder: Number(payload.displayOrder) || 0,
  };
}

async function ensureUniqueSlug(slug, excludeId) {
  const existing = await EmailTemplate.findOne({ slug }).lean();
  if (existing && String(existing._id) !== String(excludeId || '')) {
    const error = new Error('Slug already exists.');
    error.statusCode = 409;
    error.code = 'SLUG_EXISTS';
    throw error;
  }
}

async function listTemplates() {
  return EmailTemplate.find().sort({ displayOrder: 1, createdAt: -1 }).lean();
}

async function getTemplateById(id) {
  return EmailTemplate.findById(id).lean();
}

async function createTemplate(payload = {}) {
  const mapped = mapPayload(payload);
  await ensureUniqueSlug(mapped.slug);
  const item = await EmailTemplate.create(mapped);
  return EmailTemplate.findById(item._id).lean();
}

async function updateTemplateById(id, payload = {}) {
  const mapped = mapPayload(payload);
  await ensureUniqueSlug(mapped.slug, id);
  return EmailTemplate.findByIdAndUpdate(id, { $set: mapped }, { new: true }).lean();
}

async function deleteTemplateById(id) {
  const existing = await EmailTemplate.findById(id).lean();
  if (!existing) {
    return null;
  }

  await EmailTemplate.deleteOne({ _id: id });
  return existing;
}

module.exports = {
  listTemplates,
  getTemplateById,
  createTemplate,
  updateTemplateById,
  deleteTemplateById,
};
