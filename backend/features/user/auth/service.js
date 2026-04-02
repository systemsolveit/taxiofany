const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const config = require('../../../config');
const { User } = require('../../../models');

function sanitizeUser(user) {
  return {
    id: String(user._id),
    fullName: user.fullName,
    email: user.email,
    phone: user.phone,
    role: user.role,
    status: user.status,
    createdAt: user.createdAt,
  };
}

function signToken(user) {
  return jwt.sign(
    {
      sub: String(user._id),
      email: user.email,
      role: user.role,
    },
    config.jwtSecret,
    { expiresIn: config.jwtExpiresIn }
  );
}

async function registerClient(payload) {
  const email = payload.email.toLowerCase();
  const existing = await User.findOne({ email }).lean();

  if (existing) {
    const error = new Error('Email already exists.');
    error.statusCode = 409;
    error.code = 'EMAIL_EXISTS';
    throw error;
  }

  const passwordHash = await bcrypt.hash(payload.password, 10);

  const user = await User.create({
    fullName: payload.fullName,
    email,
    passwordHash,
    phone: payload.phone,
    role: 'customer',
    status: 'active',
  });

  return {
    token: signToken(user),
    user: sanitizeUser(user),
  };
}

async function loginClient(payload) {
  const email = payload.email.toLowerCase();
  const user = await User.findOne({ email }).select('+passwordHash');

  if (!user) {
    const error = new Error('Invalid email or password.');
    error.statusCode = 401;
    error.code = 'INVALID_CREDENTIALS';
    throw error;
  }

  if (user.role !== 'customer') {
    const error = new Error('This login is for client accounts only.');
    error.statusCode = 403;
    error.code = 'ROLE_NOT_ALLOWED';
    throw error;
  }

  const passwordOk = await bcrypt.compare(payload.password, user.passwordHash);
  if (!passwordOk) {
    const error = new Error('Invalid email or password.');
    error.statusCode = 401;
    error.code = 'INVALID_CREDENTIALS';
    throw error;
  }

  if (user.status !== 'active') {
    const error = new Error('Account is not active.');
    error.statusCode = 403;
    error.code = 'ACCOUNT_NOT_ACTIVE';
    throw error;
  }

  return {
    token: signToken(user),
    user: sanitizeUser(user),
  };
}

function verifyToken(token) {
  try {
    return jwt.verify(token, config.jwtSecret);
  } catch (error) {
    const err = new Error('Invalid or expired token.');
    err.statusCode = 401;
    err.code = 'INVALID_TOKEN';
    throw err;
  }
}

async function getClientProfile(userId) {
  const user = await User.findById(userId).lean();
  if (!user) {
    const error = new Error('User not found.');
    error.statusCode = 404;
    error.code = 'NOT_FOUND';
    throw error;
  }

  if (user.role !== 'customer') {
    const error = new Error('Profile is not a client account.');
    error.statusCode = 403;
    error.code = 'ROLE_NOT_ALLOWED';
    throw error;
  }

  return sanitizeUser(user);
}

module.exports = {
  registerClient,
  loginClient,
  verifyToken,
  getClientProfile,
};
