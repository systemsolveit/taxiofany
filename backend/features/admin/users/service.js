const bcrypt = require('bcryptjs');
const { User } = require('../../../models');

async function listUsers() {
  return User.find().sort({ createdAt: -1 }).lean();
}

async function getUserById(id) {
  return User.findById(id).lean();
}

async function createUser(payload = {}) {
  const email = String(payload.email || '').trim().toLowerCase();
  const existing = await User.findOne({ email }).lean();
  if (existing) {
    const error = new Error('Email already exists.');
    error.statusCode = 409;
    error.code = 'EMAIL_EXISTS';
    throw error;
  }

  const passwordHash = await bcrypt.hash(String(payload.password || ''), 10);
  const user = await User.create({
    fullName: payload.fullName,
    email,
    passwordHash,
    phone: payload.phone,
    role: payload.role,
    status: payload.status,
  });

  return User.findById(user._id).lean();
}

async function updateUserById(id, payload = {}) {
  const update = {
    fullName: payload.fullName,
    phone: payload.phone,
    role: payload.role,
    status: payload.status,
  };

  Object.keys(update).forEach((key) => {
    if (update[key] === undefined) {
      delete update[key];
    }
  });

  return User.findByIdAndUpdate(id, { $set: update }, { new: true }).lean();
}

async function deleteUserById(id, requesterId) {
  if (String(id) === String(requesterId || '')) {
    const error = new Error('You cannot delete your own account.');
    error.statusCode = 400;
    error.code = 'CANNOT_DELETE_SELF';
    throw error;
  }

  const target = await User.findById(id).lean();
  if (!target) {
    return null;
  }

  if (target.role === 'super_admin') {
    const superAdminsCount = await User.countDocuments({ role: 'super_admin' });
    if (superAdminsCount <= 1) {
      const error = new Error('Cannot delete the last super admin account.');
      error.statusCode = 400;
      error.code = 'LAST_SUPER_ADMIN';
      throw error;
    }
  }

  await User.deleteOne({ _id: id });
  return target;
}

module.exports = {
  listUsers,
  getUserById,
  createUser,
  updateUserById,
  deleteUserById,
};
