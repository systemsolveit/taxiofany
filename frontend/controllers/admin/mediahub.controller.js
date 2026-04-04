const fs = require('fs');
const mediaHubApi = require('../../services/adminMediaHubApi');

function consumeNotice(req) {
  const notice = req.session ? req.session.mediaHubNotice : null;
  if (req.session) {
    delete req.session.mediaHubNotice;
  }
  return notice;
}

function getAdminToken(req) {
  return req.session && req.session.admin ? req.session.admin.token : null;
}

function setNotice(req, type, message) {
  if (req.session) {
    req.session.mediaHubNotice = { type, message };
  }
}

function formatBytes(value) {
  const size = Number(value || 0);
  if (size < 1024) {
    return `${size} B`;
  }

  const units = ['KB', 'MB', 'GB'];
  let current = size / 1024;
  let unitIndex = 0;

  while (current >= 1024 && unitIndex < units.length - 1) {
    current /= 1024;
    unitIndex += 1;
  }

  return `${current.toFixed(current >= 10 ? 0 : 1)} ${units[unitIndex]}`;
}

function formatDate(value) {
  if (!value) {
    return 'Unknown';
  }

  return new Intl.DateTimeFormat('en-GB', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value));
}

function getKindIcon(kind) {
  switch (kind) {
    case 'image':
      return 'fas fa-image';
    case 'video':
      return 'fas fa-film';
    case 'audio':
      return 'fas fa-music';
    case 'document':
      return 'fas fa-file-alt';
    default:
      return 'fas fa-file';
  }
}

function decorateItems(items = []) {
  return items.map((item) => ({
    ...item,
    sizeLabel: formatBytes(item.size),
    uploadedAtLabel: formatDate(item.uploadedAt),
    previewUrl: `/admin/mediahub/assets/${encodeURIComponent(item.filename)}`,
    kindIcon: getKindIcon(item.kind),
    titleLabel: item.title || item.originalname,
  }));
}

function buildReturnUrl(req) {
  const params = new URLSearchParams();
  if (req.body.q || req.query.q) {
    params.set('q', req.body.q || req.query.q);
  }
  if (req.body.type || req.query.type) {
    params.set('type', req.body.type || req.query.type);
  }

  const query = params.toString();
  return query ? `/admin/mediahub?${query}` : '/admin/mediahub';
}

exports.page = async (req, res, next) => {
  const token = getAdminToken(req);
  if (!token) {
    return res.redirect('/admin/login');
  }

  try {
    const result = await mediaHubApi.listMedia(token, {
      q: req.query.q || '',
      type: req.query.type || 'all',
    });

    return res.render('admin/mediahub/upload', {
      pageTitle: 'Media Hub',
      activeSection: 'mediahub',
      library: decorateItems(result.items || []),
      summary: result.summary || { totalItems: 0, storageBytes: 0, byKind: {} },
      filteredCount: result.filteredCount || 0,
      filters: result.filters || { q: '', type: 'all' },
      storageLabel: formatBytes(result.summary?.storageBytes || 0),
      notice: consumeNotice(req),
    });
  } catch (error) {
    return next(error);
  }
};

exports.handleUpload = async (req, res) => {
  const token = getAdminToken(req);
  if (!token) {
    return res.redirect('/admin/login');
  }

  try {
    if (!req.file) {
      setNotice(req, 'warning', 'No file selected.');
      return res.redirect(buildReturnUrl(req));
    }

    const result = await mediaHubApi.uploadMedia(token, req.file, req.body);
    setNotice(req, 'success', `Uploaded ${result.originalname} successfully.`);
    return res.redirect('/admin/mediahub');
  } catch (error) {
    setNotice(req, 'danger', `Upload failed: ${error.message}`);
    return res.redirect(buildReturnUrl(req));
  } finally {
    if (req.file && req.file.path) {
      fs.promises.unlink(req.file.path).catch(() => null);
    }
  }
};

exports.updateAsset = async (req, res) => {
  const token = getAdminToken(req);
  if (!token) {
    return res.redirect('/admin/login');
  }

  try {
    await mediaHubApi.updateMedia(token, req.params.filename, req.body);
    setNotice(req, 'success', 'Media details updated successfully.');
  } catch (error) {
    setNotice(req, 'danger', `Update failed: ${error.message}`);
  }

  return res.redirect(buildReturnUrl(req));
};

exports.deleteAsset = async (req, res) => {
  const token = getAdminToken(req);
  if (!token) {
    return res.redirect('/admin/login');
  }

  try {
    await mediaHubApi.deleteMedia(token, req.params.filename);
    setNotice(req, 'success', 'Media item deleted.');
  } catch (error) {
    setNotice(req, 'danger', `Delete failed: ${error.message}`);
  }

  return res.redirect(buildReturnUrl(req));
};

exports.proxyAsset = async (req, res, next) => {
  try {
    const response = await mediaHubApi.getMediaStream(req.params.filename);
    if (response.status >= 400) {
      return res.status(response.status).end();
    }

    if (response.headers['content-type']) {
      res.setHeader('Content-Type', response.headers['content-type']);
    }
    if (response.headers['content-length']) {
      res.setHeader('Content-Length', response.headers['content-length']);
    }
    res.setHeader('Cache-Control', 'private, max-age=300');

    response.data.on('error', next);
    response.data.pipe(res);
    return undefined;
  } catch (error) {
    return next(error);
  }
};
