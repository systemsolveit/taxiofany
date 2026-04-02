const express = require('express');
const morgan = require('morgan');
const appRouter = require('./appRouter');
const logger = require('./middlewares/logger');
const errorHandler = require('./middlewares/errorHandler');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));
app.use(logger);

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
