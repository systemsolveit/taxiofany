const { AdminAuditLog } = require('../../../models');

async function logAdminAudit({ adminUserId, action, resource = '', metadata = null, ip = '' }) {
  if (!adminUserId || !action) {
    return null;
  }

  return AdminAuditLog.create({
    adminUserId,
    action: String(action).trim(),
    resource: String(resource || '').trim(),
    metadata: metadata === undefined ? null : metadata,
    ip: String(ip || '').trim(),
  });
}

function getClientIp(req) {
  if (!req) {
    return '';
  }
  const forwarded = req.headers && req.headers['x-forwarded-for'];
  if (typeof forwarded === 'string' && forwarded) {
    return forwarded.split(',')[0].trim();
  }
  return req.ip || '';
}

async function listAuditForUser(adminUserId, { page = 1, limit = 50 } = {}) {
  const safeLimit = Math.min(Math.max(Number(limit) || 50, 1), 200);
  const safePage = Math.max(Number(page) || 1, 1);
  const skip = (safePage - 1) * safeLimit;

  const [items, total] = await Promise.all([
    AdminAuditLog.find({ adminUserId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(safeLimit)
      .lean(),
    AdminAuditLog.countDocuments({ adminUserId }),
  ]);

  return {
    items,
    page: safePage,
    limit: safeLimit,
    total,
  };
}

module.exports = {
  logAdminAudit,
  getClientIp,
  listAuditForUser,
};
