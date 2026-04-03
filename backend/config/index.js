const port = Number(process.env.BACKEND_PORT || process.env.PORT) || 3000;

module.exports = {
  port,
  nodeEnv: process.env.NODE_ENV || 'development',
  mongoUri: process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/taxiofany',
  jwtSecret: process.env.JWT_SECRET || 'change-me-in-production',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '1d',
  corsOrigin: process.env.CORS_ORIGIN || '*',
  enableSwagger: process.env.ENABLE_SWAGGER !== 'false',
  swaggerServerUrl: process.env.SWAGGER_SERVER_URL || `http://localhost:${port}`,
  superAdminEmail: process.env.SUPER_ADMIN_EMAIL || '',
  superAdminPassword: process.env.SUPER_ADMIN_PASSWORD || '',
  superAdminFullName: process.env.SUPER_ADMIN_FULL_NAME || 'Super Admin',
  superAdminPhone: process.env.SUPER_ADMIN_PHONE || '',
};
