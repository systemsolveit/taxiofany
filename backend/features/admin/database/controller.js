const service = require('./service');
const auditService = require('../audit/service');

async function exportDatabase(req, res, next) {
  try {
    const data = await service.exportDatabaseJson();
    await auditService.logAdminAudit({
      adminUserId: req.auth.sub,
      action: 'database.export',
      resource: 'database',
      ip: auditService.getClientIp(req),
    });
    return res.json({ success: true, data });
  } catch (error) {
    return next(error);
  }
}

async function importDatabase(req, res, next) {
  try {
    const payload = req.body;
    const dryRun = Boolean(req.query.dryRun === '1' || req.query.dryRun === 'true');
    const data = await service.importDatabaseJson(payload, { dryRun });
    if (!dryRun) {
      await auditService.logAdminAudit({
        adminUserId: req.auth.sub,
        action: 'database.import',
        resource: 'database',
        metadata: { stats: data.stats },
        ip: auditService.getClientIp(req),
      });
    }
    return res.json({ success: true, data });
  } catch (error) {
    return next(error);
  }
}

async function resetContent(req, res, next) {
  try {
    if (String(req.body && req.body.confirm) !== 'RESET CONTENT') {
      return res.status(400).json({
        success: false,
        error: { code: 'CONFIRMATION_REQUIRED', message: 'Send body { confirm: "RESET CONTENT" }.' },
      });
    }
    const data = await service.resetContent();
    await auditService.logAdminAudit({
      adminUserId: req.auth.sub,
      action: 'database.reset_content',
      resource: 'database',
      ip: auditService.getClientIp(req),
    });
    return res.json({ success: true, data });
  } catch (error) {
    if (error.statusCode === 400) {
      return res.status(400).json({
        success: false,
        error: { code: error.code || 'BAD_REQUEST', message: error.message },
      });
    }
    return next(error);
  }
}

async function seedDemo(req, res, next) {
  try {
    const data = await service.seedDemoContent();
    await auditService.logAdminAudit({
      adminUserId: req.auth.sub,
      action: 'database.seed_demo',
      resource: 'database',
      metadata: data,
      ip: auditService.getClientIp(req),
    });
    return res.json({ success: true, data });
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  exportDatabase,
  importDatabase,
  resetContent,
  seedDemo,
};
