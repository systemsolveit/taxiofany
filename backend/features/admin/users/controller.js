const service = require('./service');

async function listUsers(req, res, next) {
  try {
    const users = await service.listUsers();
    res.json({ success: true, data: users });
  } catch (error) {
    next(error);
  }
}

async function getUser(req, res, next) {
  try {
    const user = await service.getUserById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'User not found.' } });
    }

    return res.json({ success: true, data: user });
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  listUsers,
  getUser,
};
