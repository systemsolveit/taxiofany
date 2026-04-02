const { User } = require('../../../models');

async function listUsers() {
  return User.find().sort({ createdAt: -1 }).lean();
}

async function getUserById(id) {
  return User.findById(id).lean();
}

module.exports = {
  listUsers,
  getUserById,
};
