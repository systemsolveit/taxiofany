const express = require('express');
const path = require('path');
const appRouter = require('./appRouter');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve frontend root (for top-level files like views folder)
app.use(express.static(path.join(__dirname, '..', 'frontend')));

// Map /assets to the views assets folder so HTML referencing /assets/... works
app.use('/assets', express.static(path.join(__dirname, '..', 'frontend', 'views', 'assets')));

app.use('/', appRouter);

// Basic 404 handler
app.use((req, res) => {
  res.status(404).send('Not Found');
});

module.exports = app;
