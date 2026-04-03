const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');

exports.uploadPage = (req, res) => {
  res.render('admin/mediahub/upload', { uploadResult: undefined });
};

exports.handleUpload = async (req, res) => {
  try {
    // File is available as req.file (from multer)
    if (!req.file) {
      return res.render('admin/mediahub/upload', { uploadResult: 'No file selected.' });
    }
    // Prepare form-data for backend API
    const form = new FormData();
    form.append('file', fs.createReadStream(req.file.path), req.file.originalname);
    // Add more metadata fields if needed
    const apiUrl = process.env.BACKEND_API_URL || 'http://backend:3000/api/v1/admin/mediahub';
    const apiRes = await axios.post(apiUrl, form, {
      headers: form.getHeaders(),
      maxContentLength: Infinity,
      maxBodyLength: Infinity,
    });
    res.render('admin/mediahub/upload', { uploadResult: 'Upload successful: ' + JSON.stringify(apiRes.data.data) });
  } catch (error) {
    res.render('admin/mediahub/upload', { uploadResult: 'Upload failed: ' + (error.response?.data?.error?.message || error.message) });
  }
};
