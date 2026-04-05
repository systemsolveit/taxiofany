const { param } = require('express-validator');
const validateRequest = require('../../../middlewares/validateRequest');
const service = require('./service');

async function listServices(req, res, next) {
  try {
    const items = await service.listPublishedServices();
    return res.json({ success: true, data: items });
  } catch (error) {
    return next(error);
  }
}

async function getService(req, res, next) {
  try {
    const item = await service.getPublishedServiceBySlug(req.params.slug);
    if (!item) {
      return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Service not found.' } });
    }
    return res.json({ success: true, data: item });
  } catch (error) {
    return next(error);
  }
}

const getServiceValidation = [
  param('slug').isString().trim().notEmpty(),
  validateRequest,
];

module.exports = {
  listServices,
  getService,
  getServiceValidation,
};
