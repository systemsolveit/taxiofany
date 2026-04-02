const i18nApi = require('../services/i18nApi');

const SUPPORTED = new Set(['nl', 'en']);
const FALLBACK_LOCALE = 'nl';

function getNestedValue(obj, key) {
  return key.split('.').reduce((acc, part) => (acc && acc[part] !== undefined ? acc[part] : undefined), obj);
}

function resolveLocale(req) {
  const queryLang = req.query && typeof req.query.lang === 'string' ? req.query.lang.toLowerCase() : '';
  if (SUPPORTED.has(queryLang)) {
    if (req.session) {
      req.session.uiLang = queryLang;
    }
    return queryLang;
  }

  const sessionLang = req.session && typeof req.session.uiLang === 'string' ? req.session.uiLang.toLowerCase() : '';
  if (SUPPORTED.has(sessionLang)) {
    return sessionLang;
  }

  return FALLBACK_LOCALE;
}

async function attachI18n(req, res, next) {
  const locale = resolveLocale(req);
  let dict = {};

  try {
    dict = await i18nApi.fetchDictionary(locale);
  } catch (error) {
    if (locale !== FALLBACK_LOCALE) {
      try {
        dict = await i18nApi.fetchDictionary(FALLBACK_LOCALE);
      } catch (fallbackError) {
        dict = {};
      }
    }
  }

  res.locals.locale = locale;
  res.locals.t = (key, fallback = '') => {
    const value = getNestedValue(dict, key);
    if (typeof value === 'string') {
      return value;
    }
    if (fallback) {
      return fallback;
    }
    return key;
  };

  res.locals.switchLangUrl = (langCode) => {
    const safeLang = SUPPORTED.has(String(langCode).toLowerCase()) ? String(langCode).toLowerCase() : FALLBACK_LOCALE;
    const redirect = encodeURIComponent(req.originalUrl || '/');
    return `/set-language/${safeLang}?redirect=${redirect}`;
  };

  return next();
}

function setLanguage(req, res) {
  const lang = (req.params.lang || '').toLowerCase();
  const redirectTo = typeof req.query.redirect === 'string' ? req.query.redirect : '/';

  if (SUPPORTED.has(lang) && req.session) {
    req.session.uiLang = lang;
  }

  return res.redirect(redirectTo || '/');
}

module.exports = {
  attachI18n,
  setLanguage,
};
