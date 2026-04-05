const service = require('./service');

async function listCars(req, res, next) {
  try {
    const items = await service.listCars();
    return res.json({ success: true, data: items });
  } catch (error) {
    return next(error);
  }
}

async function getCar(req, res, next) {
  try {
    const item = await service.getCarById(req.params.id);
    if (!item) {
      return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Car not found.' } });
    }
    return res.json({ success: true, data: item });
  } catch (error) {
    return next(error);
  }
}

async function createCar(req, res, next) {
  try {
    const item = await service.createCar(req.body);
    return res.status(201).json({ success: true, data: item });
  } catch (error) {
    return next(error);
  }
}

async function updateCar(req, res, next) {
  try {
    const item = await service.updateCar(req.params.id, req.body);
    if (!item) {
      return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Car not found.' } });
    }
    return res.json({ success: true, data: item });
  } catch (error) {
    return next(error);
  }
}

async function deleteCar(req, res, next) {
  try {
    const item = await service.deleteCar(req.params.id);
    if (!item) {
      return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Car not found.' } });
    }
    return res.json({ success: true, data: item });
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  listCars,
  getCar,
  createCar,
  updateCar,
  deleteCar,
};
