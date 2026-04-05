const service = require('./service');

async function listDrivers(req, res, next) {
  try {
    const items = await service.listDrivers();
    return res.json({ success: true, data: items });
  } catch (error) {
    return next(error);
  }
}

async function getDriver(req, res, next) {
  try {
    const item = await service.getDriverById(req.params.id);
    if (!item) {
      return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Driver not found.' } });
    }
    return res.json({ success: true, data: item });
  } catch (error) {
    return next(error);
  }
}

async function createDriver(req, res, next) {
  try {
    const item = await service.createDriver(req.body);
    return res.status(201).json({ success: true, data: item });
  } catch (error) {
    return next(error);
  }
}

async function updateDriver(req, res, next) {
  try {
    const item = await service.updateDriver(req.params.id, req.body);
    if (!item) {
      return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Driver not found.' } });
    }
    return res.json({ success: true, data: item });
  } catch (error) {
    return next(error);
  }
}

async function deleteDriver(req, res, next) {
  try {
    const item = await service.deleteDriver(req.params.id);
    if (!item) {
      return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Driver not found.' } });
    }
    return res.json({ success: true, data: item });
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  listDrivers,
  getDriver,
  createDriver,
  updateDriver,
  deleteDriver,
};