const { ContactSubmission } = require('../../../models');
const mailer = require('../../../services/mailer');

function mapPayload(payload = {}) {
  const firstName = String(payload.firstName || payload.firstname || '').trim();
  const lastName = String(payload.lastName || payload.lastname || '').trim();
  const fullNameRaw = String(payload.fullName || '').trim();
  const fullName = fullNameRaw || `${firstName} ${lastName}`.trim();

  return {
    fullName,
    email: String(payload.email || '').trim().toLowerCase(),
    phone: String(payload.phone || '').trim(),
    subject: String(payload.subject || 'Contact Us Inquiry').trim(),
    message: String(payload.message || '').trim(),
    sourcePage: String(payload.sourcePage || '/contact').trim(),
  };
}

async function createSubmission(payload = {}) {
  const mapped = mapPayload(payload);
  const created = await ContactSubmission.create(mapped);

  let mailResult = null;
  try {
    mailResult = await mailer.sendContactSubmissionEmail(created);
  } catch (error) {
    mailResult = {
      sent: false,
      reason: error.message,
    };
  }

  const update = {
    emailSent: Boolean(mailResult && mailResult.sent),
    emailError: mailResult && !mailResult.sent ? String(mailResult.reason || '') : '',
  };

  const final = await ContactSubmission.findByIdAndUpdate(
    created._id,
    { $set: update },
    { new: true }
  ).lean();

  return final;
}

module.exports = {
  createSubmission,
};
