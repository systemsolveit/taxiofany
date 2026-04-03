const service = require('./service');

async function listMedia(req, res, next) {
  try {
    // Placeholder: return empty list
    return res.json({ success: true, data: [] });
  } catch (error) {
    return next(error);
  }
}


async function uploadMedia(req, res, next) {
  try {
    // multer puts file info in req.file, and extra fields in req.body
    const file = req.file;
    const meta = req.body;
    if (!file) {
      return res.status(400).json({ success: false, error: { code: 'NO_FILE', message: 'No file uploaded.' } });
    }
    const result = await service.uploadMedia(file, meta);
    return res.status(201).json({ success: true, data: result });
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  listMedia,
  uploadMedia,
};
