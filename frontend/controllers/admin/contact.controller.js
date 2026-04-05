const contactApi = require('../../services/adminContactApi');

function consumeNotice(req) {
  const notice = req.session ? req.session.contactNotice : null;
  if (req.session) {
    delete req.session.contactNotice;
  }
  return notice;
}

function setNotice(req, type, message) {
  if (req.session) {
    req.session.contactNotice = { type, message };
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

exports.listPage = async (req, res, next) => {
  const token = getAdminToken(req);
  if (!token) {
    return res.redirect('/admin/login');
  }

  try {
    const submissions = await contactApi.listSubmissions(token);
    return res.render('admin/contact/list', {
      pageTitle: 'Contact Management',
      activeSection: 'contact',
      submissions,
      notice: consumeNotice(req),
    });
  } catch (error) {
    if (isAuthError(error)) {
      return redirectToLogin(req, res);
    }
    return next(error);
  }
};

exports.detailsPage = async (req, res, next) => {
  const token = getAdminToken(req);
  if (!token) {
    return res.redirect('/admin/login');
  }

  try {
    const submission = await contactApi.getSubmission(token, req.params.id);
    return res.render('admin/contact/details', {
      pageTitle: 'Contact Submission Details',
      activeSection: 'contact',
      submission,
      notice: consumeNotice(req),
    });
  } catch (error) {
    if (isAuthError(error)) {
      return redirectToLogin(req, res);
    }
    return next(error);
  }
};

exports.updateSubmission = async (req, res) => {
  const token = getAdminToken(req);
  if (!token) {
    return res.redirect('/admin/login');
  }

  try {
    const updated = await contactApi.updateSubmission(token, req.params.id, {
      status: String(req.body.status || '').trim().toLowerCase(),
    });
    setNotice(req, 'success', `Submission from ${updated.fullName} updated successfully.`);
  } catch (error) {
    if (isAuthError(error)) {
      return redirectToLogin(req, res);
    }
    setNotice(req, 'danger', `Update failed: ${error.message}`);
  }

  return res.redirect(`/admin/contact/${encodeURIComponent(req.params.id)}`);
};