const service = require('./service');

async function createSubmission(req, res, next) {
  try {
    const item = await service.createSubmission(req.body);
    return res.status(201).json({
      success: true,
      data: item,
      message: item.emailSent
        ? 'Thanks! Your message was sent successfully.'
        : 'Thanks! Your message was saved. SMTP is not configured yet, so email delivery is pending.',
    });
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  createSubmission,
};
