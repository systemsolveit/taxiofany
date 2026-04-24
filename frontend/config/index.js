require('../loadEnv');

const clientSupportWhatsappDigits = String(process.env.CLIENT_SUPPORT_WHATSAPP || '').replace(/\D/g, '');

function normalizeApiBaseUrl(value) {
  const raw = String(value || 'http://127.0.0.1:3000').trim().replace(/\/$/, '');
  return raw;
}

module.exports = {
  port: Number(process.env.FRONTEND_PORT || process.env.PORT) || 3001,
  nodeEnv: process.env.NODE_ENV || 'development',
  appName: process.env.APP_NAME || 'Taxiofany Frontend',
  /** E.164 digits only (no +), for https://wa.me/ — password recovery contact via WhatsApp */
  clientSupportWhatsapp: clientSupportWhatsappDigits.length ? clientSupportWhatsappDigits : null,
  /** Backend origin only (no /api/v1). Loaded from API_BASE_URL or repo .env via loadEnv. */
  apiBaseUrl: normalizeApiBaseUrl(process.env.API_BASE_URL),
  sessionSecret: process.env.SESSION_SECRET || 'change-me-frontend-session-secret',
  sessionCookieName: process.env.SESSION_COOKIE_NAME || 'taxiofany_admin_sid',
  sessionCookieSecure: process.env.SESSION_COOKIE_SECURE === 'true',
  sessionStoreMongoUri:
    process.env.SESSION_STORE_MONGO_URI ||
    process.env.MONGO_URI_DOCKER ||
    process.env.MONGO_URI ||
    'mongodb://127.0.0.1:27017/taxiofany',
};
