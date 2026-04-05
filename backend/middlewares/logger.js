const fs = require('fs');
const path = require('path');
const { createLogger, format, transports } = require('winston');

const logsDir = path.join(__dirname, '..', 'logs');
const combinedLogPath = path.join(logsDir, 'combined.log');
const errorLogPath = path.join(logsDir, 'error.log');
const MAX_LOG_LINES = 500;

fs.mkdirSync(logsDir, { recursive: true });

const baseFormat = format.combine(
  format.timestamp(),
  format.errors({ stack: true }),
  format.json()
);

const logger = createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: baseFormat,
  defaultMeta: { service: 'taxiofany-backend' },
  transports: [
    new transports.Console(),
    new transports.File({ filename: combinedLogPath }),
    new transports.File({ filename: errorLogPath, level: 'error' }),
  ],
  exceptionHandlers: [
    new transports.File({ filename: errorLogPath }),
  ],
  rejectionHandlers: [
    new transports.File({ filename: errorLogPath }),
  ],
  exitOnError: false,
});

function safeSerialize(value) {
  if (typeof value === 'string') {
    return value;
  }

  if (value instanceof Error) {
    return value.stack || value.message;
  }

  try {
    return JSON.stringify(value);
  } catch (error) {
    return String(value);
  }
}

function patchConsoleMethod(methodName, level) {
  const original = console[methodName] && console[methodName].bind(console);
  if (!original || original.__winstonPatched) {
    return;
  }

  const patched = (...args) => {
    logger.log({
      level,
      message: args.map((item) => safeSerialize(item)).join(' '),
      source: 'console',
      consoleMethod: methodName,
    });
  };

  patched.__winstonPatched = true;
  console[methodName] = patched;
}

patchConsoleMethod('log', 'info');
patchConsoleMethod('info', 'info');
patchConsoleMethod('warn', 'warn');
patchConsoleMethod('error', 'error');
patchConsoleMethod('debug', 'debug');

function normalizeLogLine(line) {
  const raw = String(line || '').trim();
  if (!raw) {
    return null;
  }

  try {
    const parsed = JSON.parse(raw);
    return {
      timestamp: parsed.timestamp || null,
      level: parsed.level || 'info',
      message: parsed.message || '',
      service: parsed.service || null,
      source: parsed.source || null,
      meta: parsed,
      raw,
    };
  } catch (error) {
    return {
      timestamp: null,
      level: 'info',
      message: raw,
      service: null,
      source: 'raw',
      meta: {},
      raw,
    };
  }
}

function matchesFilter(entry, options = {}) {
  const targetLevel = String(options.level || '').trim().toLowerCase();
  const search = String(options.search || '').trim().toLowerCase();

  if (targetLevel && String(entry.level || '').toLowerCase() !== targetLevel) {
    return false;
  }

  if (search) {
    const haystack = `${entry.message} ${entry.raw}`.toLowerCase();
    if (!haystack.includes(search)) {
      return false;
    }
  }

  return true;
}

async function getRecentLogs(options = {}) {
  const limit = Math.min(Math.max(Number(options.limit) || 100, 1), MAX_LOG_LINES);
  let content = '';

  try {
    content = await fs.promises.readFile(combinedLogPath, 'utf8');
  } catch (error) {
    if (error.code !== 'ENOENT') {
      throw error;
    }
  }

  const entries = content
    .split(/\r?\n/)
    .map(normalizeLogLine)
    .filter(Boolean)
    .filter((entry) => matchesFilter(entry, options))
    .slice(-limit)
    .reverse();

  return {
    files: {
      combined: combinedLogPath,
      errors: errorLogPath,
    },
    level: logger.level,
    count: entries.length,
    entries,
  };
}

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
  getRecentLogs,
};
