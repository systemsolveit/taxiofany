const { IntegrationSetting } = require('../../../models');
const mailer = require('../../../services/mailer');
const { getRecentLogs } = require('../../../middlewares/logger');

const MAIL_KEY = 'mail';
const SITE_KEY = 'site';
const NOTIFICATIONS_KEY = 'notifications';
const DEFAULT_PUBLIC_PHONE = '+32484262105';
const DEFAULT_PUBLIC_LOCATION = 'Wemmel Brussels Belgium';
const DEFAULT_WHATSAPP_COUNTRY_CODE = '32';

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
  topTagline: 'Reliable taxi service and transport solutions!',
  topLinks: [
    { key: 'help', label: 'Help', url: '/faqs', enabled: true },
    { key: 'support', label: 'Support', url: '/contact', enabled: true },
    { key: 'faq', label: 'FAQ', url: '/faqs', enabled: true },
  ],
  phone: DEFAULT_PUBLIC_PHONE,
  email: 'info@taxiofany.com',
  location: DEFAULT_PUBLIC_LOCATION,
  socialLinks: [
    { key: 'facebook', iconClass: 'fab fa-facebook-f', url: '#', enabled: true },
    { key: 'twitter', iconClass: 'fab fa-twitter', url: '#', enabled: true },
    { key: 'instagram', iconClass: 'fab fa-instagram', url: '#', enabled: true },
    { key: 'linkedin', iconClass: 'fab fa-linkedin', url: '#', enabled: true },
  ],
  navButtonLabel: 'Book Taxi',
  navButtonUrl: '/book-taxi',
};

const DEFAULT_STICKY_ICONS = {
  whatsapp: {
    enabled: true,
    color: '#25d366',
    phone: DEFAULT_PUBLIC_PHONE,
    message: 'Hello Taxiofany, I would like to book a taxi.',
  },
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

function normalizeSmtpProviderField(value) {
  const s = String(value || 'custom').trim().toLowerCase();
  if (s === 'gmail' || s === 'office365') {
    return s;
  }
  return 'custom';
}

function normalizeMailSettings(payload = {}) {
  const provider = normalizeSmtpProviderField(payload.smtpProvider);
  let smtpHost = String(payload.smtpHost || '').trim();
  let smtpPort = Number(payload.smtpPort) || 0;
  let smtpSecure = toBool(payload.smtpSecure, false);

  if (provider === 'gmail') {
    if (!smtpHost) {
      smtpHost = 'smtp.gmail.com';
    }
    if (!smtpPort) {
      smtpPort = 465;
    }
    if (payload.smtpSecure === undefined || payload.smtpSecure === null || payload.smtpSecure === '') {
      smtpSecure = true;
    }
  } else if (provider === 'office365') {
    if (!smtpHost) {
      smtpHost = 'smtp.office365.com';
    }
    if (!smtpPort) {
      smtpPort = 587;
    }
    if (payload.smtpSecure === undefined || payload.smtpSecure === null || payload.smtpSecure === '') {
      smtpSecure = false;
    }
  }

  return {
    smtpProvider: provider,
    smtpHost,
    smtpPort,
    smtpSecure,
    smtpUser: String(payload.smtpUser || '').trim(),
    smtpPass: String(payload.smtpPass || '').trim(),
    smtpFrom: String(payload.smtpFrom || '').trim(),
    contactRecipientEmail: String(payload.contactRecipientEmail || '').trim().toLowerCase(),
  };
}

function normalizeNotificationsSettings(payload = {}) {
  let rideStatusEmailTemplateId = null;
  if (payload.rideStatusEmailTemplateId !== undefined && payload.rideStatusEmailTemplateId !== null) {
    const raw = String(payload.rideStatusEmailTemplateId).trim();
    rideStatusEmailTemplateId = raw === '' ? null : raw;
  }
  let sendOnStatusChange = true;
  if (payload.sendOnStatusChange !== undefined) {
    sendOnStatusChange = toBool(payload.sendOnStatusChange, true);
  }
  return {
    rideStatusEmailTemplateId,
    sendOnStatusChange,
  };
}

function normalizeProvidedNotificationsSettings(payload = {}) {
  const normalized = normalizeNotificationsSettings(payload);
  const provided = {};
  Object.keys(normalized).forEach((key) => {
    if (Object.prototype.hasOwnProperty.call(payload, key)) {
      provided[key] = normalized[key];
    }
  });
  return provided;
}

function normalizeHexColor(value, fallback = '#1E56B8') {
  const text = String(value || '').trim();
  if (/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(text)) {
    return text;
  }
  return fallback;
}

function normalizePublicPhone(value, fallback = DEFAULT_PUBLIC_PHONE) {
  const raw = String(value || '').trim();
  if (!raw) {
    return fallback;
  }
  const digits = raw.replace(/\D/g, '');
  if (!digits) {
    return fallback;
  }
  if (raw.startsWith('+')) {
    return `+${digits}`;
  }
  return digits;
}

function normalizePublicLocation(value, fallback = DEFAULT_PUBLIC_LOCATION) {
  const text = String(value || '').trim();
  if (!text || ['New York, USA - 2386', 'Halk Street New York, USA - 2386', '153 Williamson Plaza, Maggieberg, MT 09514'].includes(text)) {
    return fallback;
  }
  return text;
}

function normalizeWhatsappPhone(value, fallback = DEFAULT_PUBLIC_PHONE) {
  const raw = String(value || fallback || '').trim();
  if (!raw) {
    return '';
  }

  const sanitized = raw.replace(/[^\d+]/g, '');
  if (sanitized.startsWith('+')) {
    return `+${sanitized.slice(1).replace(/\D/g, '')}`;
  }

  const digits = sanitized.replace(/\D/g, '').replace(/^0+/, '');
  if (!digits) {
    return '';
  }

  if (digits.startsWith(DEFAULT_WHATSAPP_COUNTRY_CODE)) {
    return `+${digits}`;
  }

  return `+${DEFAULT_WHATSAPP_COUNTRY_CODE}${digits}`;
}

function normalizeStickyWhatsapp(value = {}) {
  const fallback = DEFAULT_STICKY_ICONS.whatsapp;
  const phone = normalizeWhatsappPhone(value.phone, fallback.phone);
  const message = String(value.message || fallback.message || '').trim().slice(0, 300) || fallback.message;

  return {
    enabled: toBool(value.enabled, fallback.enabled),
    color: normalizeHexColor(value.color, fallback.color),
    phone,
    message,
  };
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
    primaryColor: normalizeHexColor(payload.primaryColor, '#1E56B8'),
    navbarMenu,
    pages: normalizedPages,
    header: {
      topTagline: String((payload.header && payload.header.topTagline) || DEFAULT_HEADER.topTagline).trim() || DEFAULT_HEADER.topTagline,
      topLinks,
      phone: normalizePublicPhone(payload.header && payload.header.phone),
      email: String((payload.header && payload.header.email) || DEFAULT_HEADER.email).trim() || DEFAULT_HEADER.email,
      location: normalizePublicLocation(payload.header && payload.header.location),
      socialLinks,
      navButtonLabel: String((payload.header && payload.header.navButtonLabel) || DEFAULT_HEADER.navButtonLabel).trim() || DEFAULT_HEADER.navButtonLabel,
      navButtonUrl: String((payload.header && payload.header.navButtonUrl) || DEFAULT_HEADER.navButtonUrl).trim() || DEFAULT_HEADER.navButtonUrl,
    },
    stickyIcons: {
      whatsapp: normalizeStickyWhatsapp(payload.stickyIcons && payload.stickyIcons.whatsapp),
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
    hints: {
      gmailAppPassword:
        'Google may block normal passwords. Create an App Password in your Google Account (Security → 2-Step Verification → App passwords) and paste it here.',
    },
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
  const testTo =
    payload && payload.testTo !== undefined && payload.testTo !== null
      ? String(payload.testTo).trim().toLowerCase()
      : '';
  const rest = { ...(payload || {}) };
  delete rest.testTo;

  const mapped = normalizeProvidedMailSettings(rest);
  const existing = await getStoredMailSettingsRaw();
  const merged = {
    ...(existing || {}),
    ...mapped,
  };

  if (!mapped.smtpPass && existing && existing.smtpPass) {
    merged.smtpPass = existing.smtpPass;
  }

  const result = await mailer.sendTestEmail({
    ...merged,
    ...(testTo ? { testTo } : {}),
  });

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

async function getStoredNotificationsRaw() {
  const record = await IntegrationSetting.findOne({ key: NOTIFICATIONS_KEY }).lean();
  if (!record || !record.value || typeof record.value !== 'object') {
    return null;
  }
  return normalizeNotificationsSettings(record.value);
}

async function getNotificationsSettings() {
  const fromDb = await getStoredNotificationsRaw();
  const effective = fromDb || normalizeNotificationsSettings({});

  return {
    source: fromDb ? 'db' : 'default',
    effective,
  };
}

async function updateNotificationsSettings(payload = {}) {
  const mapped = normalizeNotificationsSettings(payload);

  await IntegrationSetting.updateOne(
    { key: NOTIFICATIONS_KEY },
    {
      $set: {
        key: NOTIFICATIONS_KEY,
        value: mapped,
      },
    },
    { upsert: true }
  );

  return getNotificationsSettings();
}

async function patchNotificationsSettings(payload = {}) {
  const mapped = normalizeProvidedNotificationsSettings(payload);
  const existing = await getStoredNotificationsRaw();
  const next = {
    ...(existing || normalizeNotificationsSettings({})),
    ...mapped,
  };

  await IntegrationSetting.updateOne(
    { key: NOTIFICATIONS_KEY },
    {
      $set: {
        key: NOTIFICATIONS_KEY,
        value: normalizeNotificationsSettings(next),
      },
    },
    { upsert: true }
  );

  return getNotificationsSettings();
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
  getNotificationsSettings,
  updateNotificationsSettings,
  patchNotificationsSettings,
  normalizeNotificationsSettings,
};
