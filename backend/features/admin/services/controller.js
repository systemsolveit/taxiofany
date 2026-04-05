const service = require('./service');

async function listServices(req, res, next) {
  try {
    const items = await service.listServices();
    return res.json({ success: true, data: items });
  } catch (error) {
    return next(error);
  }
}

async function getService(req, res, next) {
  try {
    const item = await service.getServiceById(req.params.id);
    if (!item) {
      return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Service not found.' } });
    }
    return res.json({ success: true, data: item });
  } catch (error) {
    return next(error);
  }
}

async function createService(req, res, next) {
  try {
    const item = await service.createService(req.body);
    return res.status(201).json({ success: true, data: item });
  } catch (error) {
    return next(error);
  }
}

async function updateService(req, res, next) {
  try {
    const item = await service.updateService(req.params.id, req.body);
    if (!item) {
      return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Service not found.' } });
    }
    return res.json({ success: true, data: item });
  } catch (error) {
    return next(error);
  }
}

async function deleteService(req, res, next) {
  try {
    const item = await service.deleteService(req.params.id);
    if (!item) {
      return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Service not found.' } });
    }
    return res.json({ success: true, data: item });
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  listServices,
  getService,
  createService,
  updateService,
  deleteService,
};
