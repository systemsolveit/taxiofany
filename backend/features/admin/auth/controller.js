const service = require('./service');
const auditService = require('../audit/service');

async function register(req, res, next) {
  try {
    const { fullName, email, password, phone, role } = req.body;

    if (!fullName || !email || !password) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'fullName, email, and password are required.',
        },
      });
    }

    const user = await service.registerAdmin({ fullName, email, password, phone, role });
    return res.status(201).json({ success: true, data: user });
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

    const result = await service.loginAdmin({ email, password });
    return res.json({ success: true, data: result });
  } catch (error) {
    return next(error);
  }
}

async function me(req, res, next) {
  try {
    const user = await service.getAdminProfile(req.auth.sub);
    return res.json({ success: true, data: user });
  } catch (error) {
    return next(error);
  }
}

async function patchPassword(req, res, next) {
  try {
    await service.changeAdminPassword(req.auth.sub, req.body.currentPassword, req.body.newPassword);
    await auditService.logAdminAudit({
      adminUserId: req.auth.sub,
      action: 'auth.password_change',
      resource: 'me',
      ip: auditService.getClientIp(req),
    });
    return res.json({ success: true, data: { updated: true } });
  } catch (error) {
    if (error.statusCode === 400 || error.statusCode === 403 || error.statusCode === 404) {
      return res.status(error.statusCode).json({
        success: false,
        error: { code: error.code || 'ERROR', message: error.message },
      });
    }
    return next(error);
  }
}

async function myAudit(req, res, next) {
  try {
    const data = await auditService.listAuditForUser(req.auth.sub, {
      page: req.query.page,
      limit: req.query.limit,
    });
    return res.json({ success: true, data });
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  register,
  login,
  me,
  patchPassword,
  myAudit,
};
