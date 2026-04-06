const { getPublicSiteSettings } = require('../services/publicSettingsApi');
const { isHiddenFromMainNav } = require('../utils/navFilters');

const FALLBACK_SETTINGS = {
  primaryColor: '#f59e0b',
  navbarMenu: [],
  pages: [],
  header: {
    topLinks: [],
    phone: '5267-214-392',
    email: 'Info.ridek@mail.com',
    location: 'New York, USA - 2386',
    socialLinks: [],
    navButtonLabel: 'Book Taxi',
    navButtonUrl: '/book-taxi',
  },
};

function normalizeSettings(raw = {}) {
  const header = raw && raw.header ? raw.header : {};

  return {
    primaryColor: String(raw.primaryColor || FALLBACK_SETTINGS.primaryColor).trim() || FALLBACK_SETTINGS.primaryColor,
    navbarMenu: Array.isArray(raw.navbarMenu) ? raw.navbarMenu : [],
    pages: Array.isArray(raw.pages) ? raw.pages : [],
    header: {
      topLinks: Array.isArray(header.topLinks) ? header.topLinks : [],
      phone: String(header.phone || FALLBACK_SETTINGS.header.phone).trim() || FALLBACK_SETTINGS.header.phone,
      email: String(header.email || FALLBACK_SETTINGS.header.email).trim() || FALLBACK_SETTINGS.header.email,
      location: String(header.location || FALLBACK_SETTINGS.header.location).trim() || FALLBACK_SETTINGS.header.location,
      socialLinks: Array.isArray(header.socialLinks) ? header.socialLinks : [],
      navButtonLabel: String(header.navButtonLabel || FALLBACK_SETTINGS.header.navButtonLabel).trim() || FALLBACK_SETTINGS.header.navButtonLabel,
      navButtonUrl: String(header.navButtonUrl || FALLBACK_SETTINGS.header.navButtonUrl).trim() || FALLBACK_SETTINGS.header.navButtonUrl,
    },
  };
}

function pageEnabled(settings = {}, requestPath = '/') {
  const pages = Array.isArray(settings.pages) ? settings.pages : [];
  const navbarMenu = Array.isArray(settings.navbarMenu) ? settings.navbarMenu : [];

  const matched = pages.find((page) => {
    const path = String((page && page.path) || '').trim();
    if (!path || path === '/') {
      return requestPath === '/';
    }
    return requestPath === path || requestPath.startsWith(`${path}/`);
  });

  if (!matched) {
    return true;
  }

  if (matched.enabled) {
    return true;
  }

  const matchedMenu = navbarMenu.find((item) => {
    const url = String((item && item.url) || '').trim();
    return url && (requestPath === url || requestPath.startsWith(`${url}/`));
  });

  if (matchedMenu && matchedMenu.enabled) {
    return true;
  }

  // Keep root route reachable when an alternate home route is active.
  if (requestPath === '/') {
    const alternateHomeActive = pages.some((page) => String((page && page.path) || '').trim() === '/home/modern' && page.enabled)
      || navbarMenu.some((item) => String((item && item.url) || '').trim() === '/home/modern' && item.enabled);

    if (alternateHomeActive) {
      return true;
    }
  }

  return false;
}

async function attachSiteSettings(req, res, next) {
  res.locals.isHiddenFromMainNav = isHiddenFromMainNav;
  try {
    const settings = normalizeSettings(await getPublicSiteSettings());
    res.locals.siteSettings = settings;

    if (req.path.startsWith('/admin') || req.path.startsWith('/set-language/')) {
      return next();
    }

    if (req.path.startsWith('/account') || req.path.startsWith('/profile')) {
      return next();
    }

    if (!pageEnabled(settings, req.path)) {
      return res.status(404).render('users/errors/not-found');
    }

    return next();
  } catch (error) {
    res.locals.siteSettings = FALLBACK_SETTINGS;
    return next();
  }
}

module.exports = {
  attachSiteSettings,
};
