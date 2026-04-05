const express = require('express');
const controller = require('./controller');
const validateRequest = require('../../../middlewares/validateRequest');
const { createSubmissionValidation } = require('./validation');

const router = express.Router();

router.post('/submissions', createSubmissionValidation, validateRequest, controller.createSubmission);

module.exports = router;
