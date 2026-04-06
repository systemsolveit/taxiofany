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
    const item = await service.getTemplateById(req.params.id);
    if (!item) {
      return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Email template not found.' } });
    }

    return res.json({ success: true, data: item });
  } catch (error) {
    return next(error);
  }
}

async function createTemplate(req, res, next) {
  try {
    const item = await service.createTemplate(req.body);
    return res.status(201).json({ success: true, data: item });
  } catch (error) {
    return next(error);
  }
}

async function updateTemplate(req, res, next) {
  try {
    const item = await service.updateTemplateById(req.params.id, req.body);
    if (!item) {
      return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Email template not found.' } });
    }

    return res.json({ success: true, data: item });
  } catch (error) {
    return next(error);
  }
}

async function deleteTemplate(req, res, next) {
  try {
    const item = await service.deleteTemplateById(req.params.id);
    if (!item) {
      return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Email template not found.' } });
    }

    return res.json({ success: true, data: item });
  } catch (error) {
    return next(error);
  }
}

async function previewTemplate(req, res, next) {
  try {
    const data = await service.previewTemplateById(req.params.id);
    if (!data) {
      return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Email template not found.' } });
    }

    return res.json({ success: true, data });
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  listTemplates,
  getTemplate,
  createTemplate,
  updateTemplate,
  deleteTemplate,
  previewTemplate,
};
