const driversApi = require('../../services/driversApi');
const publicContentApi = require('../../services/publicContentApi');

async function listDriversSafely() {
  try {
    const items = await driversApi.listDrivers();
    return Array.isArray(items) ? items : [];
  } catch (error) {
    return [];
  }
}

exports.listPage = async (req, res) => {
  const drivers = await listDriversSafely();
  return res.render('users/drivers/list', { drivers });
};

exports.detailsPage = async (req, res) => {
  const slug = req.params.slug || req.query.driver;
  const drivers = await listDriversSafely();
  let driver = null;

  if (slug) {
    try {
      driver = await driversApi.getDriverBySlug(slug);
    } catch (error) {
      driver = null;
    }
  }

  if (!driver && drivers.length) {
    driver = drivers[0];
  }

  const relatedDrivers = drivers.filter((item) => !driver || String(item.slug) !== String(driver.slug)).slice(0, 6);
  const testimonials = await publicContentApi.listTestimonials(6);
  return res.render('users/drivers/details', { driver, relatedDrivers, testimonials });
};

exports.testimonialsPage = async (req, res) => {
  const testimonials = await publicContentApi.listTestimonials(12);
  res.render('users/testimonials/index', { testimonials });
};
