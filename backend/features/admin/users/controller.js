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

async function createUser(req, res, next) {
  try {
    const user = await service.createUser({
      fullName: req.body.fullName,
      email: req.body.email,
      password: req.body.password,
      phone: req.body.phone,
      role: req.body.role,
      status: req.body.status,
    });

    return res.status(201).json({ success: true, data: user });
  } catch (error) {
    return next(error);
  }
}

async function updateUser(req, res, next) {
  try {
    const user = await service.updateUserById(req.params.id, {
      fullName: req.body.fullName,
      phone: req.body.phone,
      role: req.body.role,
      status: req.body.status,
    });

    if (!user) {
      return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'User not found.' } });
    }

    return res.json({ success: true, data: user });
  } catch (error) {
    return next(error);
  }
}

async function deleteUser(req, res, next) {
  try {
    const user = await service.deleteUserById(req.params.id, req.auth && req.auth.sub);
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
  createUser,
  updateUser,
  deleteUser,
};
