const contactApi = require('../../services/contactApi');

exports.indexPage = (req, res) => {
  res.render('users/contact/index');
};

exports.thankYouPage = (req, res) => {
  res.render('users/contact/thank-you');
};

exports.submitMessage = async (req, res) => {
  try {
    await contactApi.createSubmission({
      firstName: String(req.body.firstname || '').trim(),
      lastName: String(req.body.lastname || '').trim(),
      email: String(req.body.email || '').trim().toLowerCase(),
      phone: String(req.body.phone || '').trim(),
      message: String(req.body.message || '').trim(),
      sourcePage: '/contact',
      subject: 'Contact Us Form',
    });

    const wl =
      res.locals && typeof res.locals.withLocale === 'function'
        ? res.locals.withLocale
        : (path) => path;
    return res.redirect(302, wl('/contact/thank-you'));
  } catch (error) {
    const wantsJson =
      req.xhr ||
      (req.get('accept') || '').includes('application/json') ||
      (req.get('x-requested-with') || '').toLowerCase() === 'xmlhttprequest';
    if (wantsJson) {
      return res.status(error.statusCode || 500).send(error.message || 'Contact submission failed.');
    }
    const wl =
      res.locals && typeof res.locals.withLocale === 'function'
        ? res.locals.withLocale
        : (path) => path;
    return res.redirect(302, wl('/contact?error=1'));
  }
};
