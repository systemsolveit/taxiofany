const { IntegrationSetting } = require('../../../models');
const mailer = require('../../../services/mailer');
const { getRecentLogs } = require('../../../middlewares/logger');

const MAIL_KEY = 'mail';
const SITE_KEY = 'site';

const DEFAULT_NAVBAR_MENU = [
  { key: 'home', label: 'Home', url: '/', enabled: true },
  { key: 'about', label: 'About', url: '/about', enabled: true },
  { key: 'services', label: 'Services', url: '/services', enabled: true },
  { key: 'drivers', label: 'Drivers', url: '/drivers', enabled: true },
  { key: 'taxi', label: 'Taxi', url: '/taxi', enabled: true },
  { key: 'blog', label: 'Blog', url: '/blog', enabled: true },
  { key: 'contact', label: 'Contact', url: '/contact', enabled: true },
];

const DEFAULT_PAGES = [
  { key: 'home', title: 'Home', path: '/', enabled: true },
  { key: 'home-modern', title: 'Home Modern', path: '/home/modern', enabled: false },
  { key: 'packages', title: 'Packages', path: '/packages', enabled: false },
  { key: 'solutions', title: 'Solutions', path: '/solutions', enabled: false },
  { key: 'about', title: 'About', path: '/about', enabled: true },
  { key: 'about-company', title: 'About Company', path: '/about/company', enabled: false },
  { key: 'services', title: 'Services', path: '/services', enabled: true },
  { key: 'service-details', title: 'Service Details', path: '/services/details', enabled: false },
  { key: 'drivers', title: 'Drivers', path: '/drivers', enabled: true },
  { key: 'driver-details', title: 'Driver Details', path: '/drivers/details', enabled: false },
  { key: 'testimonials', title: 'Testimonials', path: '/testimonials', enabled: false },
  { key: 'taxi', title: 'Taxi', path: '/taxi', enabled: true },
  { key: 'taxi-details', title: 'Taxi Details', path: '/taxi/details', enabled: false },
  { key: 'blog', title: 'Blog', path: '/blog', enabled: true },
  { key: 'blog-classic', title: 'Blog Classic', path: '/blog/classic', enabled: false },
  { key: 'blog-details', title: 'Blog Details', path: '/blog/details', enabled: false },
  { key: 'contact', title: 'Contact', path: '/contact', enabled: true },
  { key: 'faq', title: 'FAQs', path: '/faqs', enabled: false },
  { key: 'bookings', title: 'Book Taxi', path: '/book-taxi', enabled: true },
  { key: 'booking-create', title: 'Booking Create', path: '/bookings/create', enabled: false },
  { key: 'booking-details', title: 'Booking Details', path: '/bookings', enabled: false },
  { key: 'emails', title: 'Emails', path: '/emails', enabled: false },
  { key: 'email-details', title: 'Email Details', path: '/emails', enabled: false },
  { key: 'profile', title: 'Profile', path: '/profile', enabled: false },
  { key: 'account-register', title: 'Account Register', path: '/account/register', enabled: false },
  { key: 'account-login', title: 'Account Login', path: '/account/login', enabled: false },
  { key: 'account-dashboard', title: 'Account Dashboard', path: '/account', enabled: false },
  { key: 'account-trips', title: 'Account Trips', path: '/account/trips', enabled: false },
  { key: 'account-password', title: 'Account Password', path: '/account/password', enabled: false },
  { key: 'error-404', title: 'Error 404', path: '/404', enabled: false },
];

const DEFAULT_HEADER = {
  topLinks: [
    { key: 'help', label: 'Help', url: '/faqs', enabled: true },
    { key: 'support', label: 'Support', url: '/contact', enabled: true },
    { key: 'faq', label: 'FAQ', url: '/faqs', enabled: true },
  ],
  phone: '5267-214-392',
  email: 'Info.ridek@mail.com',
  location: 'New York, USA - 2386',
  socialLinks: [
    { key: 'facebook', iconClass: 'fab fa-facebook-f', url: '#', enabled: true },
    { key: 'twitter', iconClass: 'fab fa-twitter', url: '#', enabled: true },
    { key: 'instagram', iconClass: 'fab fa-instagram', url: '#', enabled: true },
    { key: 'linkedin', iconClass: 'fab fa-linkedin', url: '#', enabled: true },
  ],
  navButtonLabel: 'Book Taxi',
  navButtonUrl: '/book-taxi',
};

function toBool(value, fallback = false) {
  if (typeof value === 'boolean') {
    return value;
  }

  const text = String(value || '').trim().toLowerCase();
  if (['1', 'true', 'yes', 'on'].includes(text)) {
    return true;
  }
  if (['0', 'false', 'no', 'off'].includes(text)) {
    return false;
  }
  return fallback;
}

function normalizeMailSettings(payload = {}) {
  return {
    smtpHost: String(payload.smtpHost || '').trim(),
    smtpPort: Number(payload.smtpPort) || 0,
    smtpSecure: toBool(payload.smtpSecure, false),
    smtpUser: String(payload.smtpUser || '').trim(),
    smtpPass: String(payload.smtpPass || '').trim(),
    smtpFrom: String(payload.smtpFrom || '').trim(),
    contactRecipientEmail: String(payload.contactRecipientEmail || '').trim().toLowerCase(),
  };
}

function normalizeHexColor(value, fallback = '#f59e0b') {
  const text = String(value || '').trim();
  if (/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(text)) {
    return text;
  }
  return fallback;
}

function normalizeMenuItem(item = {}, index = 0) {
  const fallback = DEFAULT_NAVBAR_MENU[index] || {};
  const key = String(item.key || fallback.key || `menu-${index + 1}`)
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9-_]/g, '-');
  const label = String(item.label || fallback.label || '').trim() || `Menu ${index + 1}`;
  const urlRaw = String(item.url || fallback.url || '/').trim() || '/';
  const url = urlRaw.startsWith('/') ? urlRaw : `/${urlRaw}`;

  return {
    key,
    label,
    url,
    enabled: toBool(item.enabled, true),
  };
}

function normalizePageItem(item = {}, index = 0) {
  const fallback = DEFAULT_PAGES[index] || {};
  const key = String(item.key || fallback.key || `page-${index + 1}`)
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9-_]/g, '-');
  const title = String(item.title || fallback.title || '').trim() || `Page ${index + 1}`;
  const pathRaw = String(item.path || fallback.path || '/').trim() || '/';
  const path = pathRaw.startsWith('/') ? pathRaw : `/${pathRaw}`;

  return {
    key,
    title,
    path,
    enabled: toBool(item.enabled, true),
  };
}

function normalizeTopLinkItem(item = {}, index = 0) {
  const fallback = DEFAULT_HEADER.topLinks[index] || {};
  const key = String(item.key || fallback.key || `top-link-${index + 1}`)
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9-_]/g, '-');
  const label = String(item.label || fallback.label || '').trim() || `Top Link ${index + 1}`;
  const urlRaw = String(item.url || fallback.url || '/').trim() || '/';
  const url = urlRaw.startsWith('/') ? urlRaw : `/${urlRaw}`;

  return {
    key,
    label,
    url,
    enabled: toBool(item.enabled, true),
  };
}

function normalizeSocialItem(item = {}, index = 0) {
  const fallback = DEFAULT_HEADER.socialLinks[index] || {};
  const key = String(item.key || fallback.key || `social-${index + 1}`)
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9-_]/g, '-');
  const iconClass = String(item.iconClass || fallback.iconClass || 'fas fa-link').trim() || 'fas fa-link';
  const url = String(item.url || fallback.url || '#').trim() || '#';

  return {
    key,
    iconClass,
    url,
    enabled: toBool(item.enabled, true),
  };
}

function syncNavbarWithPages(navbarMenu = [], pages = []) {
  const menuByKey = new Map();
  const menuByUrl = new Map();

  navbarMenu.forEach((item) => {
    if (!item || !item.key) {
      return;
    }

    menuByKey.set(item.key, item);
    menuByUrl.set(item.url, item);
  });

  const fromPages = pages.map((page, index) => {
    const matched = menuByKey.get(page.key) || menuByUrl.get(page.path);

    return normalizeMenuItem(
      {
        key: page.key,
        label: (matched && matched.label) || page.title,
        url: page.path,
        enabled: matched ? matched.enabled : page.enabled,
      },
      index
    );
  });

  const pageKeys = new Set(pages.map((page) => page.key));
  const pageUrls = new Set(pages.map((page) => page.path));
  const customExtras = navbarMenu.filter((item, index) => {
    if (!item) {
      return false;
    }

    if (pageKeys.has(item.key) || pageUrls.has(item.url)) {
      return false;
    }

    return Boolean(normalizeMenuItem(item, fromPages.length + index).label);
  });

  return [...fromPages, ...customExtras];
}

function syncPagesWithNavbar(pages = [], navbarMenu = []) {
  const menuByKey = new Map();
  const menuByUrl = new Map();

  navbarMenu.forEach((item) => {
    if (!item) {
      return;
    }

    if (item.key) {
      menuByKey.set(item.key, item);
    }

    if (item.url) {
      menuByUrl.set(item.url, item);
    }
  });

  return pages.map((page, index) => {
    const matched = menuByKey.get(page.key) || menuByUrl.get(page.path);
    return normalizePageItem(
      {
        ...page,
        enabled: matched ? Boolean(page.enabled || matched.enabled) : page.enabled,
      },
      index
    );
  });
}

function normalizeSiteSettings(payload = {}) {
  const rawNavbarMenu = Array.isArray(payload.navbarMenu) && payload.navbarMenu.length
    ? payload.navbarMenu.map((item, index) => normalizeMenuItem(item, index))
    : DEFAULT_NAVBAR_MENU.map((item, index) => normalizeMenuItem(item, index));

  const providedPages = Array.isArray(payload.pages) && payload.pages.length
    ? payload.pages.map((item, index) => normalizePageItem(item, index))
    : [];

  const providedByKey = new Map();
  const providedByPath = new Map();
  providedPages.forEach((item) => {
    providedByKey.set(item.key, item);
    providedByPath.set(item.path, item);
  });

  const catalogPages = DEFAULT_PAGES.map((item, index) => normalizePageItem(item, index));
  const mergedCatalog = catalogPages.map((basePage, index) => {
    const provided = providedByKey.get(basePage.key) || providedByPath.get(basePage.path);
    if (!provided) {
      return basePage;
    }

    return normalizePageItem(
      {
        ...basePage,
        ...provided,
      },
      index
    );
  });

  const catalogKeys = new Set(mergedCatalog.map((item) => item.key));
  const catalogPaths = new Set(mergedCatalog.map((item) => item.path));
  const extraProvided = providedPages.filter((item, index) => {
    if (catalogKeys.has(item.key) || catalogPaths.has(item.path)) {
      return false;
    }

    return Boolean(normalizePageItem(item, mergedCatalog.length + index).title);
  });

  const pages = [...mergedCatalog, ...extraProvided];

  const navbarMenu = syncNavbarWithPages(rawNavbarMenu, pages);
  const normalizedPages = syncPagesWithNavbar(pages, navbarMenu);

  const topLinks = payload.header && Array.isArray(payload.header.topLinks) && payload.header.topLinks.length
    ? payload.header.topLinks.map((item, index) => normalizeTopLinkItem(item, index))
    : DEFAULT_HEADER.topLinks.map((item, index) => normalizeTopLinkItem(item, index));

  const socialLinks = payload.header && Array.isArray(payload.header.socialLinks) && payload.header.socialLinks.length
    ? payload.header.socialLinks.map((item, index) => normalizeSocialItem(item, index))
    : DEFAULT_HEADER.socialLinks.map((item, index) => normalizeSocialItem(item, index));

  return {
    primaryColor: normalizeHexColor(payload.primaryColor, '#f59e0b'),
    navbarMenu,
    pages: normalizedPages,
    header: {
      topLinks,
      phone: String((payload.header && payload.header.phone) || DEFAULT_HEADER.phone).trim() || DEFAULT_HEADER.phone,
      email: String((payload.header && payload.header.email) || DEFAULT_HEADER.email).trim() || DEFAULT_HEADER.email,
      location: String((payload.header && payload.header.location) || DEFAULT_HEADER.location).trim() || DEFAULT_HEADER.location,
      socialLinks,
      navButtonLabel: String((payload.header && payload.header.navButtonLabel) || DEFAULT_HEADER.navButtonLabel).trim() || DEFAULT_HEADER.navButtonLabel,
      navButtonUrl: String((payload.header && payload.header.navButtonUrl) || DEFAULT_HEADER.navButtonUrl).trim() || DEFAULT_HEADER.navButtonUrl,
    },
  };
}

function normalizeProvidedMailSettings(payload = {}) {
  const normalized = normalizeMailSettings(payload);
  const provided = {};

  Object.keys(normalized).forEach((key) => {
    if (Object.prototype.hasOwnProperty.call(payload, key)) {
      provided[key] = normalized[key];
    }
  });

  return provided;
}

function sanitizeForResponse(settings = {}) {
  const safe = { ...settings };
  if (safe.smtpPass) {
    safe.smtpPass = '********';
  }
  return safe;
}

async function getStoredMailSettingsRaw() {
  const record = await IntegrationSetting.findOne({ key: MAIL_KEY }).lean();
  if (!record || !record.value || typeof record.value !== 'object') {
    return null;
  }

  return normalizeMailSettings(record.value);
}

async function getStoredSiteSettingsRaw() {
  const record = await IntegrationSetting.findOne({ key: SITE_KEY }).lean();
  if (!record || !record.value || typeof record.value !== 'object') {
    return null;
  }

  return normalizeSiteSettings(record.value);
}

async function getMailSettings() {
  const fromDb = await getStoredMailSettingsRaw();
  const effective = await mailer.getResolvedMailConfig();

  return {
    source: fromDb ? 'db' : 'env',
    stored: sanitizeForResponse(fromDb || {}),
    effective: sanitizeForResponse(effective),
    smtpConfigured: mailer.isMailConfigUsable(effective),
  };
}

async function updateMailSettings(payload = {}) {
  const mapped = normalizeProvidedMailSettings(payload);
  const existing = await getStoredMailSettingsRaw();
  const next = {
    ...(existing || {}),
    ...mapped,
  };

  if (!mapped.smtpPass && existing && existing.smtpPass) {
    next.smtpPass = existing.smtpPass;
  }

  await IntegrationSetting.updateOne(
    { key: MAIL_KEY },
    {
      $set: {
        key: MAIL_KEY,
        value: next,
      },
    },
    { upsert: true }
  );

  return getMailSettings();
}

async function getLogs(options = {}) {
  return getRecentLogs(options);
}

async function testMailSettings(payload = {}) {
  const mapped = normalizeProvidedMailSettings(payload);
  const existing = await getStoredMailSettingsRaw();
  const merged = {
    ...(existing || {}),
    ...mapped,
  };

  if (!mapped.smtpPass && existing && existing.smtpPass) {
    merged.smtpPass = existing.smtpPass;
  }

  const result = await mailer.sendTestEmail(merged);

  return {
    success: Boolean(result && result.sent),
    details: result,
  };
}

async function getSiteSettings() {
  const fromDb = await getStoredSiteSettingsRaw();
  const effective = fromDb || normalizeSiteSettings({});

  return {
    source: fromDb ? 'db' : 'default',
    effective,
  };
}

async function updateSiteSettings(payload = {}) {
  const mapped = normalizeSiteSettings(payload);

  await IntegrationSetting.updateOne(
    { key: SITE_KEY },
    {
      $set: {
        key: SITE_KEY,
        value: mapped,
      },
    },
    { upsert: true }
  );

  return getSiteSettings();
}

module.exports = {
  getMailSettings,
  updateMailSettings,
  getLogs,
  testMailSettings,
  getStoredMailSettingsRaw,
  getSiteSettings,
  updateSiteSettings,
  getStoredSiteSettingsRaw,
  normalizeSiteSettings,
};
