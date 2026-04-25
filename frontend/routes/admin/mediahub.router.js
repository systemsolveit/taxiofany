const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const mediahubController = require('../../controllers/admin/mediahub.controller');

const router = express.Router();

const tempUploadDirectory = path.join(__dirname, '../../uploads/tmp');
fs.mkdirSync(tempUploadDirectory, { recursive: true });

const upload = multer({ dest: tempUploadDirectory });

router.get('/', mediahubController.page);
router.get('/upload', (req, res) => res.redirect('/admin/mediahub'));
router.get('/actions/images', mediahubController.imageChoices);
router.get('/assets/:filename', mediahubController.proxyAsset);
router.post('/upload', upload.single('file'), mediahubController.handleUpload);
router.post('/:filename/update', mediahubController.updateAsset);
router.post('/:filename/delete', mediahubController.deleteAsset);

module.exports = router;
