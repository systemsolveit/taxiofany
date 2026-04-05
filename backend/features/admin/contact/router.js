const express = require('express');
const controller = require('./controller');
const validateRequest = require('../../../middlewares/validateRequest');
const { requireAdminAuth } = require('../auth/middleware');
const { submissionIdValidation, updateSubmissionValidation } = require('./validation');

const router = express.Router();

router.get('/submissions', requireAdminAuth, controller.listSubmissions);
router.get('/submissions/:id', requireAdminAuth, submissionIdValidation, validateRequest, controller.getSubmission);
router.patch('/submissions/:id', requireAdminAuth, updateSubmissionValidation, validateRequest, controller.updateSubmission);

module.exports = router;
