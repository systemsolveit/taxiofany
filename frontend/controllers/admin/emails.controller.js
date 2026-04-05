const emailsApi = require('../../services/adminEmailsApi');

function consumeNotice(req) {
  const notice = req.session ? req.session.emailsNotice : null;
  if (req.session) {
    delete req.session.emailsNotice;
  }
  return notice;
}

function setNotice(req, type, message) {
  if (req.session) {
    req.session.emailsNotice = { type, message };
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

function mapPayload(body = {}) {
  return {
    title: String(body.title || '').trim(),
    slug: String(body.slug || '').trim(),
    category: String(body.category || '').trim(),
    audience: String(body.audience || '').trim(),
    subject: String(body.subject || '').trim(),
    previewText: String(body.previewText || '').trim(),
    summary: String(body.summary || '').trim(),
    heroTitle: String(body.heroTitle || '').trim(),
    heroDescription: String(body.heroDescription || '').trim(),
    bodyTitle: String(body.bodyTitle || '').trim(),
    bodyContent: String(body.bodyContent || '').trim(),
    ctaLabel: String(body.ctaLabel || '').trim(),
    ctaUrl: String(body.ctaUrl || '').trim(),
    tone: String(body.tone || '').trim(),
    isPublished: body.isPublished === 'true' || body.isPublished === 'on',
    displayOrder: Number(body.displayOrder) || 0,
  };
}

function emptyTemplate() {
  return {
    title: '',
    slug: '',
    category: 'Transactional',
    audience: 'Customers',
    subject: '',
    previewText: '',
    summary: '',
    heroTitle: '',
    heroDescription: '',
    bodyTitle: '',
    bodyContent: '',
    ctaLabel: '',
    ctaUrl: '',
    tone: 'Professional',
    isPublished: true,
    displayOrder: 0,
  };
}

exports.listPage = async (req, res, next) => {
  const token = getAdminToken(req);
  if (!token) {
    return res.redirect('/admin/login');
  }

  try {
    const templates = await emailsApi.listTemplates(token);
    return res.render('admin/emails/list', {
      pageTitle: 'Email Management',
      activeSection: 'emails',
      templates,
      notice: consumeNotice(req),
    });
  } catch (error) {
    if (isAuthError(error)) {
      return redirectToLogin(req, res);
    }
    return next(error);
  }
};

exports.newPage = (req, res) => {
  if (!getAdminToken(req)) {
    return res.redirect('/admin/login');
  }

  return res.render('admin/emails/form', {
    pageTitle: 'Create Email Template',
    activeSection: 'emails',
    mode: 'create',
    template: emptyTemplate(),
    notice: consumeNotice(req),
  });
};

exports.editPage = async (req, res, next) => {
  const token = getAdminToken(req);
  if (!token) {
    return res.redirect('/admin/login');
  }

  try {
    const template = await emailsApi.getTemplate(token, req.params.id);
    return res.render('admin/emails/form', {
      pageTitle: 'Edit Email Template',
      activeSection: 'emails',
      mode: 'edit',
      template,
      notice: consumeNotice(req),
    });
  } catch (error) {
    if (isAuthError(error)) {
      return redirectToLogin(req, res);
    }
    return next(error);
  }
};

exports.createTemplate = async (req, res) => {
  const token = getAdminToken(req);
  if (!token) {
    return res.redirect('/admin/login');
  }

  try {
    const item = await emailsApi.createTemplate(token, mapPayload(req.body));
    setNotice(req, 'success', `Email template "${item.title}" created successfully.`);
    return res.redirect('/admin/emails');
  } catch (error) {
    if (isAuthError(error)) {
      return redirectToLogin(req, res);
    }
    setNotice(req, 'danger', `Create failed: ${error.message}`);
    return res.redirect('/admin/emails/new');
  }
};

exports.updateTemplate = async (req, res) => {
  const token = getAdminToken(req);
  if (!token) {
    return res.redirect('/admin/login');
  }

  try {
    const item = await emailsApi.updateTemplate(token, req.params.id, mapPayload(req.body));
    setNotice(req, 'success', `Email template "${item.title}" updated successfully.`);
  } catch (error) {
    if (isAuthError(error)) {
      return redirectToLogin(req, res);
    }
    setNotice(req, 'danger', `Update failed: ${error.message}`);
  }

  return res.redirect('/admin/emails');
};

exports.deleteTemplate = async (req, res) => {
  const token = getAdminToken(req);
  if (!token) {
    return res.redirect('/admin/login');
  }

  try {
    await emailsApi.deleteTemplate(token, req.params.id);
    setNotice(req, 'success', 'Email template deleted successfully.');
  } catch (error) {
    if (isAuthError(error)) {
      return redirectToLogin(req, res);
    }
    setNotice(req, 'danger', `Delete failed: ${error.message}`);
  }

  return res.redirect('/admin/emails');
};
