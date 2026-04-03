const path = require('path');
const swaggerJsdoc = require('swagger-jsdoc');
const config = require('./index');

const options = {
  definition: {
    openapi: '3.0.3',
    info: {
      title: 'TaxiOfany API',
      version: '1.0.0',
      description: 'Swagger v1 documentation for TaxiOfany backend APIs.',
    },
    servers: [{ url: config.swaggerServerUrl }],
  },
  apis: [
    path.join(__dirname, '../appRouter.js'),
    path.join(__dirname, '../features/admin/auth/router.js'),
    path.join(__dirname, '../features/user/auth/router.js'),
    path.join(__dirname, '../features/user/bookings/router.js'),
  ],
};

module.exports = swaggerJsdoc(options);