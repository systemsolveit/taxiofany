const { param } = require('express-validator');
const validateRequest = require('../../../middlewares/validateRequest');
const service = require('./service');

async function listCars(req, res, next) {
  try {
    const items = await service.listPublishedCars();
    return res.json({ success: true, data: items });
  } catch (error) {
    return next(error);
  }
}

async function getCar(req, res, next) {
  try {
    const item = await service.getPublishedCarBySlug(req.params.slug);
    if (!item) {
      return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Car not found.' } });
    }
    return res.json({ success: true, data: item });
  } catch (error) {
    return next(error);
  }
}

const getCarValidation = [
  param('slug').isString().trim().notEmpty(),
  validateRequest,
];

module.exports = {
  listCars,
  getCar,
  getCarValidation,
};
