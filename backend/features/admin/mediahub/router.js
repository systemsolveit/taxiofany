const express = require('express');
const controller = require('./controller');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const { requireAdminAuth, requirePermission } = require('../auth/middleware');
const { PERMISSIONS } = require('../auth/permissionsCatalog');
// const validateRequest = require('../../../middlewares/validateRequest');
// const { someValidation } = require('./validation');

const uploadDirectory = path.join(__dirname, '../../../uploads/mediahub');

// Configure multer for disk storage (uploads/mediahub/)
const upload = multer({
	storage: multer.diskStorage({
		destination: (req, file, cb) => {
			fs.mkdirSync(uploadDirectory, { recursive: true });
			cb(null, uploadDirectory);
		},
		filename: (req, file, cb) => {
			const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
			cb(null, unique + '-' + file.originalname.replace(/\s+/g, '_'));
		},
	}),
	limits: { fileSize: 10 * 1024 * 1024 }, // 10MB max
});

const router = express.Router();

/**
 * @openapi
 * /api/v1/admin/mediahub:
 *   get:
 *     tags: [Media Hub]
 *     summary: List media assets (placeholder)
 *     responses:
 *       200:
 *         description: Media assets returned
 */
router.get('/', requireAdminAuth, requirePermission(PERMISSIONS.MEDIAHUB_READ), controller.listMedia);


/**
 * @openapi
 * /api/v1/admin/mediahub:
 *   post:
 *     tags: [Media Hub]
 *     summary: Upload a media asset (placeholder)
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Media asset uploaded
 */
router.post('/', requireAdminAuth, requirePermission(PERMISSIONS.MEDIAHUB_WRITE), upload.single('file'), controller.uploadMedia);
router.patch('/:filename', requireAdminAuth, requirePermission(PERMISSIONS.MEDIAHUB_WRITE), controller.updateMedia);
router.delete('/:filename', requireAdminAuth, requirePermission(PERMISSIONS.MEDIAHUB_WRITE), controller.deleteMedia);

module.exports = router;
