const { EmailTemplate } = require('../../../models');

async function listTemplates() {
  return EmailTemplate.find({ isPublished: true }).sort({ displayOrder: 1, createdAt: -1 }).lean();
}

async function getTemplateBySlug(slug) {
  return EmailTemplate.findOne({ slug: String(slug || '').trim().toLowerCase(), isPublished: true }).lean();
}

module.exports = {
  listTemplates,
  getTemplateBySlug,
};
