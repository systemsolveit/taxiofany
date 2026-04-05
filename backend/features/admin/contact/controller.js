const service = require('./service');

async function listSubmissions(req, res, next) {
  try {
    const items = await service.listSubmissions();
    return res.json({ success: true, data: items });
  } catch (error) {
    return next(error);
  }
}

async function getSubmission(req, res, next) {
  try {
    const item = await service.getSubmissionById(req.params.id);
    if (!item) {
      return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Contact submission not found.' } });
    }

    return res.json({ success: true, data: item });
  } catch (error) {
    return next(error);
  }
}

async function updateSubmission(req, res, next) {
  try {
    const item = await service.updateSubmissionStatus(req.params.id, req.body.status);
    if (!item) {
      return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Contact submission not found.' } });
    }

    return res.json({ success: true, data: item });
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  listSubmissions,
  getSubmission,
  updateSubmission,
};
