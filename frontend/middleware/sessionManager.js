const session = require('express-session');
const MongoStore = require('connect-mongo');
const config = require('../config');

function createSessionMiddleware() {
  return session({
    name: config.sessionCookieName,
    secret: config.sessionSecret,
    store: MongoStore.create({
      mongoUrl: config.sessionStoreMongoUri,
      collectionName: 'frontend_sessions',
      ttl: 60 * 60 * 12,
      autoRemove: 'native',
    }),
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      sameSite: 'lax',
      secure: config.sessionCookieSecure,
      maxAge: 1000 * 60 * 60 * 12,
    },
  });
}

function attachSessionLocals(req, res, next) {
  const admin = req.session && req.session.admin ? req.session.admin : null;
  const client = req.session && req.session.client ? req.session.client : null;
  res.locals.adminSession = admin;
  res.locals.clientSession = client;
  next();
}

module.exports = {
  createSessionMiddleware,
  attachSessionLocals,
};
