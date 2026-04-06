const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const config = require('../../../config');
const { User } = require('../../../models');

const ADMIN_ROLES = new Set(['super_admin', 'admin', 'dispatcher']);

function sanitizeUser(user) {
  return {
    id: String(user._id),
    fullName: user.fullName,
    email: user.email,
    phone: user.phone,
    role: user.role,
    status: user.status,
    lastLoginAt: user.lastLoginAt,
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

async function registerAdmin(payload) {
  const existing = await User.findOne({ email: payload.email.toLowerCase() }).lean();
  if (existing) {
    const error = new Error('Email already exists.');
    error.statusCode = 409;
    error.code = 'EMAIL_EXISTS';
    throw error;
  }

  const role = payload.role && ADMIN_ROLES.has(payload.role) ? payload.role : 'admin';
  const passwordHash = await bcrypt.hash(payload.password, 10);

  const user = await User.create({
    fullName: payload.fullName,
    email: payload.email.toLowerCase(),
    passwordHash,
    phone: payload.phone,
    role,
    status: 'active',
  });

  return sanitizeUser(user);
}

async function loginAdmin(payload) {
  const user = await User.findOne({ email: payload.email.toLowerCase() }).select('+passwordHash');

  if (!user) {
    const error = new Error('Invalid email or password.');
    error.statusCode = 401;
    error.code = 'INVALID_CREDENTIALS';
    throw error;
  }

  if (!ADMIN_ROLES.has(user.role)) {
    const error = new Error('Access denied for non-admin account.');
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

  user.lastLoginAt = new Date();
  await user.save();

  const token = signToken(user);

  return {
    token,
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

async function getAdminProfile(userId) {
  const user = await User.findById(userId).lean();
  if (!user) {
    const error = new Error('User not found.');
    error.statusCode = 404;
    error.code = 'NOT_FOUND';
    throw error;
  }

  if (!ADMIN_ROLES.has(user.role)) {
    const error = new Error('Profile is not an admin account.');
    error.statusCode = 403;
    error.code = 'ROLE_NOT_ALLOWED';
    throw error;
  }

  return sanitizeUser(user);
}

async function changeAdminPassword(userId, currentPassword, newPassword) {
  const user = await User.findById(userId).select('+passwordHash');
  if (!user) {
    const error = new Error('User not found.');
    error.statusCode = 404;
    error.code = 'NOT_FOUND';
    throw error;
  }

  if (!ADMIN_ROLES.has(user.role)) {
    const error = new Error('Access denied for non-admin account.');
    error.statusCode = 403;
    error.code = 'ROLE_NOT_ALLOWED';
    throw error;
  }

  const currentOk = await bcrypt.compare(String(currentPassword || ''), user.passwordHash);
  if (!currentOk) {
    const error = new Error('Current password is incorrect.');
    error.statusCode = 400;
    error.code = 'INVALID_PASSWORD';
    throw error;
  }

  user.passwordHash = await bcrypt.hash(String(newPassword || ''), 10);
  await user.save();

  return { updated: true };
}

module.exports = {
  ADMIN_ROLES,
  registerAdmin,
  loginAdmin,
  verifyToken,
  getAdminProfile,
  changeAdminPassword,
};
