const service = require('./service');
const auditService = require('../audit/service');
const emailsService = require('../emails/service');

async function getMailSettings(req, res, next) {
  try {
    const data = await service.getMailSettings();
    return res.json({ success: true, data });
  } catch (error) {
    return next(error);
  }
}

async function updateMailSettings(req, res, next) {
  try {
    const data = await service.updateMailSettings(req.body);
    await auditService.logAdminAudit({
      adminUserId: req.auth.sub,
      action: 'settings.mail_update',
      resource: 'mail',
      ip: auditService.getClientIp(req),
    });
    return res.json({ success: true, data });
  } catch (error) {
    return next(error);
  }
}

async function testMailSettings(req, res, next) {
  try {
    const data = await service.testMailSettings(req.body);
    return res.json({ success: true, data });
  } catch (error) {
    return next(error);
  }
}

async function getSiteSettings(req, res, next) {
  try {
    const data = await service.getSiteSettings();
    return res.json({ success: true, data });
  } catch (error) {
    return next(error);
  }
}

async function updateSiteSettings(req, res, next) {
  try {
    const data = await service.updateSiteSettings(req.body);
    await auditService.logAdminAudit({
      adminUserId: req.auth.sub,
      action: 'settings.site_update',
      resource: 'site',
      ip: auditService.getClientIp(req),
    });
    return res.json({ success: true, data });
  } catch (error) {
    return next(error);
  }
}

async function getLogs(req, res, next) {
  try {
    const data = await service.getLogs({
      limit: req.query.limit,
      level: req.query.level,
      search: req.query.search,
    });
    return res.json({ success: true, data });
  } catch (error) {
    return next(error);
  }
}

async function getNotificationsSettings(req, res, next) {
  try {
    await emailsService.ensureRideStatusDefaultTemplate();
    const data = await service.getNotificationsSettings();
    return res.json({ success: true, data });
  } catch (error) {
    return next(error);
  }
}

async function patchNotificationsSettings(req, res, next) {
  try {
    const data = await service.patchNotificationsSettings(req.body);
    await auditService.logAdminAudit({
      adminUserId: req.auth.sub,
      action: 'settings.notifications_update',
      resource: 'notifications',
      metadata: req.body,
      ip: auditService.getClientIp(req),
    });
    return res.json({ success: true, data });
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  getMailSettings,
  updateMailSettings,
  testMailSettings,
  getSiteSettings,
  updateSiteSettings,
  getLogs,
  getNotificationsSettings,
  patchNotificationsSettings,
};
