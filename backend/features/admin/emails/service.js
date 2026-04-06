const { EmailTemplate } = require('../../../models');
const mailer = require('../../../services/mailer');

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

const RIDE_STATUS_SLUG = 'ride-status-update';

function sampleRidePlaceholders() {
  return {
    customerName: 'Jane Doe',
    bookingCode: 'TX-10042',
    status: 'confirmed',
    previousStatus: 'pending',
    pickup: '123 Main Street, Downtown',
    destination: 'International Airport — Terminal 2',
    rideDate: 'April 3, 2026',
    fareAmount: '45.00',
  };
}

async function previewTemplateById(id) {
  const templateDoc = await EmailTemplate.findById(id).lean();
  if (!templateDoc) {
    return null;
  }

  const map = sampleRidePlaceholders();
  const subject = mailer.applyPlaceholderMap(templateDoc.subject || '', map);
  const innerHtml = mailer.buildRideEmailInnerFromTemplate(templateDoc, map);
  const primaryColor = await mailer.getSitePrimaryColor();
  const html = mailer.buildThemedRideEmailHtml({ primaryColor, innerHtml });

  return { subject, html };
}

async function ensureRideStatusDefaultTemplate() {
  const existing = await EmailTemplate.findOne({ slug: RIDE_STATUS_SLUG }).lean();
  if (existing) {
    return existing;
  }

  const created = await EmailTemplate.create({
    title: 'Ride status update',
    slug: RIDE_STATUS_SLUG,
    category: 'Transactional',
    audience: 'Customers',
    subject: 'Your booking {{bookingCode}} is now {{status}}',
    previewText: 'Ride status notification',
    summary: 'Sent when an admin changes a booking status.',
    heroTitle: 'Hello {{customerName}}',
    heroDescription: 'Your ride request has been updated.',
    bodyTitle: 'Trip details',
    bodyContent:
      'Booking code: {{bookingCode}}\nPrevious status: {{previousStatus}}\nNew status: {{status}}\nPickup: {{pickup}}\nDestination: {{destination}}\nDate: {{rideDate}}',
    ctaLabel: '',
    ctaUrl: '',
    tone: 'Professional',
    isPublished: true,
    displayOrder: 0,
  });

  return EmailTemplate.findById(created._id).lean();
}

module.exports = {
  listTemplates,
  getTemplateById,
  createTemplate,
  updateTemplateById,
  deleteTemplateById,
  previewTemplateById,
  ensureRideStatusDefaultTemplate,
  sampleRidePlaceholders,
};
