const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const swaggerUi = require('swagger-ui-express');
const config = require('./config');
const swaggerSpec = require('./config/swagger');
const appRouter = require('./appRouter');
const { morganStream, requestLogger } = require('./middlewares/logger');
const errorHandler = require('./middlewares/errorHandler');

const app = express();

const corsConfig = {
  origin: config.corsOrigin === '*' ? '*' : config.corsOrigin.split(',').map((origin) => origin.trim()),
  credentials: true,
};

app.use(helmet());
app.use(cors(corsConfig));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan(config.nodeEnv === 'production' ? 'combined' : 'dev', { stream: morganStream }));
app.use(requestLogger);

if (config.enableSwagger) {
  app.use('/api/v1/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, { explorer: true }));
}

app.use('/', appRouter);

app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: {
      code: 'NOT_FOUND',
      message: 'Route not found.',
    },
  });
});

app.use(errorHandler);

module.exports = app;
