const express = require('express');
const aclRouter = require('./acl/router');
const authRouter = require('./auth/router');
const i18nRouter = require('./i18n/router');
const usersRouter = require('./users/router');

const router = express.Router();

router.use('/auth', authRouter);
router.use('/acl', aclRouter);
router.use('/i18n', i18nRouter);
router.use('/users', usersRouter);

module.exports = router;
