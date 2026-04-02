const service = require('./service');

async function register(req, res, next) {
  try {
    const { fullName, email, password, phone } = req.body;

    if (!fullName || !email || !password) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'fullName, email, and password are required.',
        },
      });
    }

    const result = await service.registerClient({ fullName, email, password, phone });
    return res.status(201).json({ success: true, data: result });
  } catch (error) {
    return next(error);
  }
}

async function login(req, res, next) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'email and password are required.',
        },
      });
    }

    const result = await service.loginClient({ email, password });
    return res.json({ success: true, data: result });
  } catch (error) {
    return next(error);
  }
}

async function me(req, res, next) {
  try {
    const user = await service.getClientProfile(req.auth.sub);
    return res.json({ success: true, data: user });
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  register,
  login,
  me,
};
