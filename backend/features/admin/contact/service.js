const { ContactSubmission } = require('../../../models');

async function listSubmissions() {
  return ContactSubmission.find().sort({ createdAt: -1 }).lean();
}

async function getSubmissionById(id) {
  return ContactSubmission.findById(id).lean();
}

async function updateSubmissionStatus(id, status) {
  return ContactSubmission.findByIdAndUpdate(
    id,
    { $set: { status: String(status || '').trim().toLowerCase() } },
    { new: true }
  ).lean();
}

module.exports = {
  listSubmissions,
  getSubmissionById,
  updateSubmissionStatus,
};
