const { createLogger, format, transports } = require('winston');

const logger = createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: format.combine(format.timestamp(), format.json()),
  defaultMeta: { service: 'taxiofany-backend' },
  transports: [new transports.Console()],
});

const morganStream = {
  write: (message) => {
    logger.http(message.trim());
  },
};

function requestLogger(req, res, next) {
  const startTime = Date.now();

  res.on('finish', () => {
    logger.info('http_request', {
      method: req.method,
      path: req.originalUrl,
      statusCode: res.statusCode,
      responseTimeMs: Date.now() - startTime,
      ip: req.ip,
    });
  });

  next();
}

module.exports = {
  logger,
  morganStream,
  requestLogger,
};
