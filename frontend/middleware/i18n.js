const i18nApi = require('../services/i18nApi');

const DEFAULT_SUPPORTED = ['nl', 'en'];
const FALLBACK_LOCALE = 'nl';

function shouldSkipLocalePrefix(pathname) {
  const path = String(pathname || '/').toLowerCase();
  return (
    path.startsWith('/admin') ||
    path.startsWith('/set-language') ||
    path.startsWith('/assets') ||
    path.startsWith('/css') ||
    path.startsWith('/js') ||
    path.startsWith('/uploads') ||
    path === '/favicon.ico' ||
    path === '/robots.txt' ||
    path === '/sitemap.xml'
  );
}

function shouldSkipI18n(pathname) {
  const path = String(pathname || '/').toLowerCase();
  return (
    path.startsWith('/assets') ||
    path.startsWith('/css') ||
    path.startsWith('/js') ||
    path.startsWith('/uploads') ||
    path === '/favicon.ico' ||
    path === '/robots.txt' ||
    path === '/sitemap.xml'
  );
}

function getNestedValue(obj, key) {
  return key.split('.').reduce((acc, part) => (acc && acc[part] !== undefined ? acc[part] : undefined), obj);
}

function humanizeKey(key) {
  const raw = String(key || '').trim();
  if (!raw) {
    return '';
  }

  const lastSegment = raw.split('.').pop() || raw;
  const withSpaces = lastSegment
    .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
    .replace(/[_\-]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  if (!withSpaces) {
    return raw;
  }

  return withSpaces.charAt(0).toUpperCase() + withSpaces.slice(1);
}

async function getSupportedLocales() {
  try {
    const locales = await i18nApi.fetchLocales();
    if (Array.isArray(locales) && locales.length > 0) {
      return Array.from(new Set(locales.map((item) => String(item).toLowerCase())));
    }
  } catch (error) {
    // Fail soft so i18n still works when locale API is unavailable.
  }

  return DEFAULT_SUPPORTED;
}

async function resolveLocale(req, supportedLocales) {
  const supported = new Set(supportedLocales.map((item) => item.toLowerCase()));
  const queryLang = req.query && typeof req.query.lang === 'string' ? req.query.lang.toLowerCase() : '';
  if (supported.has(queryLang)) {
    if (req.session) {
      req.session.uiLang = queryLang;
    }
    return queryLang;
  }

  const sessionLang = req.session && typeof req.session.uiLang === 'string' ? req.session.uiLang.toLowerCase() : '';
  if (supported.has(sessionLang)) {
    return sessionLang;
  }

  return FALLBACK_LOCALE;
}

async function attachI18n(req, res, next) {
  if (shouldSkipI18n(req.path)) {
    return next();
  }

  const supportedLocales = await getSupportedLocales();
  const supportedLocaleSet = new Set(supportedLocales.map((item) => item.toLowerCase()));
  const locale = await resolveLocale(req, supportedLocales);
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
  res.locals.availableLocales = supportedLocales.map((code) => ({
    code,
    label: code.toUpperCase(),
  }));
  res.locals.t = (key, fallback = '') => {
    const value = getNestedValue(dict, key);
    if (typeof value === 'string') {
      return value;
    }
    if (fallback) {
      return fallback;
    }
    return humanizeKey(key);
  };

  res.locals.switchLangUrl = (langCode) => {
    const safeLang = String(langCode || '').toLowerCase();
    const normalized = supportedLocales.includes(safeLang) ? safeLang : FALLBACK_LOCALE;
    const originalUrl = req.originalUrl || req.url || '/';
    const queryIndex = originalUrl.indexOf('?');
    const pathOnly = queryIndex >= 0 ? originalUrl.slice(0, queryIndex) : originalUrl;
    const queryString = queryIndex >= 0 ? originalUrl.slice(queryIndex) : '';
    const segments = String(pathOnly || '/')
      .split('/')
      .filter(Boolean);

    if (segments.length > 0 && supportedLocaleSet.has(String(segments[0]).toLowerCase())) {
      segments.shift();
    }

    let targetPath = segments.length > 0 ? `/${segments.join('/')}` : '';
    if (targetPath === '/bookings/submit') {
      targetPath = '/book-taxi';
    }
    return `/${normalized}${targetPath}${queryString}`;
  };

  const safeLocale = supportedLocales.includes(locale) ? locale : FALLBACK_LOCALE;
  res.locals.withLocale = (pathname) => {
    const raw = pathname === undefined || pathname === null ? '/' : String(pathname).trim();
    const path = raw === '' ? '/' : (raw.startsWith('/') ? raw : `/${raw}`);
    if (path === '/') {
      return `/${safeLocale}`;
    }
    return `/${safeLocale}${path}`;
  };

  return next();
}

async function setLanguage(req, res) {
  const supportedLocales = await getSupportedLocales();
  const supported = new Set(supportedLocales.map((item) => item.toLowerCase()));
  const lang = (req.params.lang || '').toLowerCase();
  const redirectTo = typeof req.query.redirect === 'string' ? req.query.redirect : '/';

  if (supported.has(lang) && req.session) {
    req.session.uiLang = lang;
  }

  return res.redirect(redirectTo || '/');
}

async function handleLocalePrefix(req, res, next) {
  const supportedLocales = await getSupportedLocales();
  const supported = new Set(supportedLocales.map((item) => item.toLowerCase()));
  const path = req.path || '/';
  const segments = path.split('/').filter(Boolean);
  const queryIndex = (req.url || '').indexOf('?');
  const queryString = queryIndex >= 0 ? req.url.slice(queryIndex) : '';

  if (segments.length === 0) {
    if ((req.method === 'GET' || req.method === 'HEAD') && !shouldSkipLocalePrefix(path)) {
      const locale = await resolveLocale(req, supportedLocales);
      return res.redirect(`/${locale}${queryString}`);
    }
    return next();
  }

  const firstSegment = String(segments[0] || '').toLowerCase();
  if (!supported.has(firstSegment)) {
    if ((req.method === 'GET' || req.method === 'HEAD') && !shouldSkipLocalePrefix(path)) {
      const locale = await resolveLocale(req, supportedLocales);
      return res.redirect(`/${locale}${path}${queryString}`);
    }
    return next();
  }

  if (req.session) {
    req.session.uiLang = firstSegment;
  }

  const rest = segments.slice(1).join('/');
  const rewrittenPath = rest ? `/${rest}` : '/';
  req.url = `${rewrittenPath}${queryString}`;
  delete req._parsedUrl;

  return next();
}

module.exports = {
  attachI18n,
  setLanguage,
  handleLocalePrefix,
};
