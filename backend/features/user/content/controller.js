const service = require('./service');

async function listTestimonials(req, res, next) {
  try {
    const items = await service.listPublishedTestimonials({ limit: req.query.limit });
    return res.json({ success: true, data: items });
  } catch (error) {
    return next(error);
  }
}

async function listPackages(req, res, next) {
  try {
    const items = await service.listPublishedPackages({ limit: req.query.limit });
    return res.json({ success: true, data: items });
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  listTestimonials,
  listPackages,
};
