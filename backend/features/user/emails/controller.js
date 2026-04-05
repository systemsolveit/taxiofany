const service = require('./service');

async function listTemplates(req, res, next) {
  try {
    const items = await service.listTemplates();
    return res.json({ success: true, data: items });
  } catch (error) {
    return next(error);
  }
}

async function getTemplate(req, res, next) {
  try {
    const item = await service.getTemplateBySlug(req.params.slug);
    if (!item) {
      return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Email template not found.' } });
    }

    return res.json({ success: true, data: item });
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  listTemplates,
  getTemplate,
};
