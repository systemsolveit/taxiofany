const express = require('express');
const aclRouter = require('./acl/router');
const authRouter = require('./auth/router');
const usersRouter = require('./users/router');

const router = express.Router();

router.use('/auth', authRouter);
router.use('/acl', aclRouter);
router.use('/users', usersRouter);

module.exports = router;
