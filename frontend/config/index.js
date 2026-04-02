module.exports = {
  port: Number(process.env.FRONTEND_PORT || process.env.PORT) || 3001,
  nodeEnv: process.env.NODE_ENV || 'development',
  appName: process.env.APP_NAME || 'Taxiofany Frontend',
  apiBaseUrl: process.env.API_BASE_URL || 'http://localhost:3000',
  sessionSecret: process.env.SESSION_SECRET || 'change-me-frontend-session-secret',
  sessionCookieName: process.env.SESSION_COOKIE_NAME || 'taxiofany_admin_sid',
  sessionCookieSecure: process.env.SESSION_COOKIE_SECURE === 'true',
  sessionStoreMongoUri:
    process.env.SESSION_STORE_MONGO_URI ||
    process.env.MONGO_URI_DOCKER ||
    process.env.MONGO_URI ||
    'mongodb://127.0.0.1:27017/taxiofany',
};
