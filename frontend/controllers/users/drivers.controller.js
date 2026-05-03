const publicContentApi = require('../../services/publicContentApi');

function redirectToPublicHome(req, res) {
  const wl = res.locals && typeof res.locals.withLocale === 'function' ? res.locals.withLocale : (p) => p;
  return res.redirect(302, wl('/'));
}

/** Driver list and profile pages are disabled on the public site. */
exports.listPage = redirectToPublicHome;
exports.detailsPage = redirectToPublicHome;

exports.testimonialsPage = async (req, res) => {
  const testimonials = await publicContentApi.listTestimonials(12);
  res.render('users/testimonials/index', { testimonials });
};
