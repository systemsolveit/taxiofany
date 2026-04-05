const service = require('./service');

async function getMailSettings(req, res, next) {
  try {
    const data = await service.getMailSettings();
    return res.json({ success: true, data });
  } catch (error) {
    return next(error);
  }
}

async function updateMailSettings(req, res, next) {
  try {
    const data = await service.updateMailSettings(req.body);
    return res.json({ success: true, data });
  } catch (error) {
    return next(error);
  }
}

async function testMailSettings(req, res, next) {
  try {
    const data = await service.testMailSettings(req.body);
    return res.json({ success: true, data });
  } catch (error) {
    return next(error);
  }
}

async function getSiteSettings(req, res, next) {
  try {
    const data = await service.getSiteSettings();
    return res.json({ success: true, data });
  } catch (error) {
    return next(error);
  }
}

async function updateSiteSettings(req, res, next) {
  try {
    const data = await service.updateSiteSettings(req.body);
    return res.json({ success: true, data });
  } catch (error) {
    return next(error);
  }
}

async function getLogs(req, res, next) {
  try {
    const data = await service.getLogs({
      limit: req.query.limit,
      level: req.query.level,
      search: req.query.search,
    });
    return res.json({ success: true, data });
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  getMailSettings,
  updateMailSettings,
  testMailSettings,
  getSiteSettings,
  updateSiteSettings,
  getLogs,
};
