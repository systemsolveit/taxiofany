const service = require('./service');

async function getDictionary(req, res, next) {
  try {
    const { locale } = req.params;
    const result = await service.getDictionary(locale);
    return res.json({ success: true, data: result });
  } catch (error) {
    return next(error);
  }
}

async function getLocales(req, res, next) {
  try {
    const locales = await service.listSupportedLocales();
    return res.json({ success: true, data: locales });
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  getDictionary,
  getLocales,
};
