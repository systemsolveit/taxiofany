const rateLimit = require('express-rate-limit');

function formatRateLimitResponse(message) {
  return {
    success: false,
    error: {
      code: 'RATE_LIMITED',
      message,
    },
  };
}

function createLimiter({ windowMs, max, message }) {
  return rateLimit({
    windowMs,
    max,
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res) => {
      res.status(429).json(formatRateLimitResponse(message));
    },
  });
}

function createApiRateLimiter(config) {
  return createLimiter({
    windowMs: config.apiRateLimitWindowMs,
    max: config.apiRateLimitMax,
    message: 'Too many API requests. Please retry shortly.',
  });
}

function createAuthRateLimiter(config) {
  return createLimiter({
    windowMs: config.authRateLimitWindowMs,
    max: config.authRateLimitMax,
    message: 'Too many authentication attempts. Please wait before trying again.',
  });
}

module.exports = {
  createApiRateLimiter,
  createAuthRateLimiter,
};