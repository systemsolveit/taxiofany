const { param } = require('express-validator');
const validateRequest = require('../../../middlewares/validateRequest');
const service = require('./service');

async function listDrivers(req, res, next) {
  try {
    const items = await service.listPublishedDrivers();
    return res.json({ success: true, data: items });
  } catch (error) {
    return next(error);
  }
}

async function getDriver(req, res, next) {
  try {
    const item = await service.getPublishedDriverBySlug(req.params.slug);
    if (!item) {
      return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Driver not found.' } });
    }
    return res.json({ success: true, data: item });
  } catch (error) {
    return next(error);
  }
}

const getDriverValidation = [
  param('slug').isString().trim().notEmpty(),
  validateRequest,
];

module.exports = {
  listDrivers,
  getDriver,
  getDriverValidation,
};