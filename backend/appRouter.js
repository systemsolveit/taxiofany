const express = require('express');
const path = require('path');
const router = express.Router();

router.get('/', (req, res) => {
  res.sendFile('views/index.html', { root: path.join(__dirname, '..', 'frontend') });
});

router.get('/about', (req, res) => {
  res.sendFile('views/about.html', { root: path.join(__dirname, '..', 'frontend') });
});

router.get('/api/status', (req, res) => {
  res.json({ status: 'ok', uptime: process.uptime() });
});

module.exports = router;
