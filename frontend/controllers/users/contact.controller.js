const contactApi = require('../../services/contactApi');

exports.indexPage = (req, res) => {
  res.render('users/contact/index');
};

exports.submitMessage = async (req, res) => {
  try {
    const payload = await contactApi.createSubmission({
      firstName: String(req.body.firstname || '').trim(),
      lastName: String(req.body.lastname || '').trim(),
      email: String(req.body.email || '').trim().toLowerCase(),
      phone: String(req.body.phone || '').trim(),
      message: String(req.body.message || '').trim(),
      sourcePage: '/contact',
      subject: 'Contact Us Form',
    });

    return res.send(payload.message || 'Thanks! Your message was sent successfully.');
  } catch (error) {
    return res.status(error.statusCode || 500).send(error.message || 'Contact submission failed.');
  }
};
