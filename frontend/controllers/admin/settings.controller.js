const settingsApi = require('../../services/adminSettingsApi');

function consumeNotice(req) {
  const notice = req.session ? req.session.settingsNotice : null;
  if (req.session) {
    delete req.session.settingsNotice;
  }
  return notice;
}

function setNotice(req, type, message) {
  if (req.session) {
    req.session.settingsNotice = { type, message };
  }
}

function getAdminToken(req) {
  return req.session && req.session.admin ? req.session.admin.token : null;
}

function isAuthError(error) {
  return error && (error.statusCode === 401 || error.statusCode === 403);
}

function redirectToLogin(req, res, message) {
  if (req.session) {
    delete req.session.admin;
    req.session.authError = message || 'Your admin session expired. Please log in again.';
  }
  return res.redirect('/admin/login');
}

function mapMailPayload(body = {}) {
  const payload = {};

  if (body.smtpHost !== undefined) payload.smtpHost = String(body.smtpHost || '').trim();
  if (body.smtpPort !== undefined) {
    const port = Number(body.smtpPort);
    if (Number.isFinite(port) && port > 0) {
      payload.smtpPort = port;
    }
  }
  if (body.smtpSecure !== undefined) {
    payload.smtpSecure = body.smtpSecure === 'true' || body.smtpSecure === true || body.smtpSecure === 'on';
  }
  if (body.smtpUser !== undefined) payload.smtpUser = String(body.smtpUser || '').trim();
  if (body.smtpPass !== undefined) payload.smtpPass = String(body.smtpPass || '').trim();
  if (body.smtpFrom !== undefined) payload.smtpFrom = String(body.smtpFrom || '').trim();
  if (body.contactRecipientEmail !== undefined) {
    payload.contactRecipientEmail = String(body.contactRecipientEmail || '').trim().toLowerCase();
  }

  return payload;
}

function parseCollection(value) {
  if (Array.isArray(value)) {
    return value;
  }

  if (value && typeof value === 'object') {
    return Object.keys(value)
      .sort((a, b) => Number(a) - Number(b))
      .map((key) => value[key]);
  }

  return [];
}

function parseBoolInput(value) {
  const finalValue = Array.isArray(value) ? value[value.length - 1] : value;
  return finalValue === 'true' || finalValue === true || finalValue === 'on' || finalValue === '1';
}

function mapSitePayload(body = {}) {
  return {
    primaryColor: String(body.primaryColor || '').trim(),
    navbarMenu: parseCollection(body.navbarMenu).map((item = {}) => ({
      key: String(item.key || '').trim().toLowerCase(),
      label: String(item.label || '').trim(),
      url: String(item.url || '').trim(),
      enabled: parseBoolInput(item.enabled),
    })),
    pages: parseCollection(body.pages).map((item = {}) => ({
      key: String(item.key || '').trim().toLowerCase(),
      title: String(item.title || '').trim(),
      path: String(item.path || '').trim(),
      enabled: parseBoolInput(item.enabled),
    })),
    header: {
      topLinks: parseCollection(body.header && body.header.topLinks).map((item = {}) => ({
        key: String(item.key || '').trim().toLowerCase(),
        label: String(item.label || '').trim(),
        url: String(item.url || '').trim(),
        enabled: parseBoolInput(item.enabled),
      })),
      phone: String((body.header && body.header.phone) || '').trim(),
      email: String((body.header && body.header.email) || '').trim(),
      location: String((body.header && body.header.location) || '').trim(),
      socialLinks: parseCollection(body.header && body.header.socialLinks).map((item = {}) => ({
        key: String(item.key || '').trim().toLowerCase(),
        iconClass: String(item.iconClass || '').trim(),
        url: String(item.url || '').trim(),
        enabled: parseBoolInput(item.enabled),
      })),
      navButtonLabel: String((body.header && body.header.navButtonLabel) || '').trim(),
      navButtonUrl: String((body.header && body.header.navButtonUrl) || '').trim(),
    },
  };
}

exports.mailSettingsPage = async (req, res, next) => {
  const token = getAdminToken(req);
  if (!token) {
    return res.redirect('/admin/login');
  }

  try {
    const data = await settingsApi.getMailSettings(token);
    return res.render('admin/settings/mail', {
      pageTitle: 'Settings - Mail Integrations',
      activeSection: 'settings',
      tab: 'mail',
      mailSettings: data,
      notice: consumeNotice(req),
    });
  } catch (error) {
    if (isAuthError(error)) {
      return redirectToLogin(req, res);
    }
    return next(error);
  }
};

exports.updateMailSettings = async (req, res) => {
  const token = getAdminToken(req);
  if (!token) {
    return res.redirect('/admin/login');
  }

  try {
    await settingsApi.updateMailSettings(token, mapMailPayload(req.body));
    setNotice(req, 'success', 'Mail integration settings saved successfully.');
  } catch (error) {
    if (isAuthError(error)) {
      return redirectToLogin(req, res);
    }
    setNotice(req, 'danger', `Save failed: ${error.message}`);
  }

  return res.redirect('/admin/settings/mail');
};

exports.testMailSettings = async (req, res) => {
  const token = getAdminToken(req);
  if (!token) {
    return res.redirect('/admin/login');
  }

  try {
    const result = await settingsApi.testMailSettings(token, {});
    if (result && result.success) {
      setNotice(req, 'success', 'SMTP test email sent successfully.');
    } else {
      setNotice(req, 'warning', `SMTP test did not send email: ${(result && result.details && result.details.reason) || 'unknown reason'}`);
    }
  } catch (error) {
    if (isAuthError(error)) {
      return redirectToLogin(req, res);
    }
    setNotice(req, 'danger', `SMTP test failed: ${error.message}`);
  }

  return res.redirect('/admin/settings/mail');
};

exports.siteSettingsPage = async (req, res, next) => {
  const token = getAdminToken(req);
  if (!token) {
    return res.redirect('/admin/login');
  }

  try {
    const data = await settingsApi.getSiteSettings(token);
    return res.render('admin/settings/site', {
      pageTitle: 'Settings - Site',
      activeSection: 'settings',
      tab: 'site',
      siteSettings: data,
      notice: consumeNotice(req),
    });
  } catch (error) {
    if (isAuthError(error)) {
      return redirectToLogin(req, res);
    }
    return next(error);
  }
};

exports.updateSiteSettings = async (req, res) => {
  const token = getAdminToken(req);
  if (!token) {
    return res.redirect('/admin/login');
  }

  try {
    await settingsApi.updateSiteSettings(token, mapSitePayload(req.body));
    setNotice(req, 'success', 'Site settings saved successfully.');
  } catch (error) {
    if (isAuthError(error)) {
      return redirectToLogin(req, res);
    }
    setNotice(req, 'danger', `Save failed: ${error.message}`);
  }

  return res.redirect('/admin/settings/site');
};
