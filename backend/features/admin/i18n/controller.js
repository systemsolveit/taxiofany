const service = require('./service');

async function getLocales(req, res, next) {
  try {
    return res.json({ success: true, data: service.listLocales() });
  } catch (error) {
    return next(error);
  }
}

async function getEntries(req, res, next) {
  try {
    const locale = req.query.locale || 'nl';
    const entries = await service.listEntries(locale);
    return res.json({ success: true, data: { locale, entries } });
  } catch (error) {
    return next(error);
  }
}

async function saveEntry(req, res, next) {
  try {
    const { locale, key, value } = req.body;
    const result = await service.upsertEntry({
      locale,
      key,
      value,
      updatedBy: req.auth && req.auth.sub ? req.auth.sub : undefined,
    });
    return res.json({ success: true, data: result });
  } catch (error) {
    return next(error);
  }
}

async function extractKeywords(req, res, next) {
  try {
    const limit = Number(req.query.limit) || 120;
    const keywords = service.extractKeywords(limit);
    return res.json({ success: true, data: keywords });
  } catch (error) {
    return next(error);
  }
}

async function translateKeywords(req, res, next) {
  try {
    const texts = Array.isArray(req.body.texts) ? req.body.texts : [];
    const source = req.body.source || 'en';
    const target = req.body.target || 'nl';

    if (!texts.length) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'texts array is required.',
        },
      });
    }

    const data = await service.translateKeywords({ texts, source, target });
    return res.json({ success: true, data });
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  getLocales,
  getEntries,
  saveEntry,
  extractKeywords,
  translateKeywords,
};
