const express = require('express');
const multer = require('multer');
const path = require('path');
const mediahubController = require('../../controllers/admin/mediahub.controller');

const router = express.Router();

// Multer config for temp storage before forwarding to backend
const upload = multer({ dest: path.join(__dirname, '../../uploads/tmp') });

router.get('/upload', mediahubController.uploadPage);
router.post('/upload', upload.single('file'), mediahubController.handleUpload);

module.exports = router;
