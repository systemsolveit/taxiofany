const servicesApi = require('../../services/servicesApi');
const blogApi = require('../../services/blogApi');
const publicContentApi = require('../../services/publicContentApi');

async function loadPublishedServicesSafely(limit = 6) {
  try {
    const services = await servicesApi.listServices();
    return Array.isArray(services) ? services.slice(0, limit) : [];
  } catch (error) {
    return [];
  }
}

async function loadLatestBlogPostsSafely(limit = 3) {
  try {
    const result = await blogApi.listPosts({ page: 1, limit });
    return result && Array.isArray(result.items) ? result.items : [];
  } catch (error) {
    return [];
  }
}

exports.aboutUs = async (req, res, next) => {
  try {
    const [services, latestBlogPosts, testimonials] = await Promise.all([
      loadPublishedServicesSafely(6),
      loadLatestBlogPostsSafely(3),
      publicContentApi.listTestimonials(6),
    ]);
    return res.render('users/company/about-us', {
      services,
      latestBlogPosts,
      testimonials,
    });
  } catch (error) {
    return next(error);
  }
};

exports.aboutCompany = async (req, res, next) => {
  try {
    const [services, latestBlogPosts, testimonials] = await Promise.all([
      loadPublishedServicesSafely(6),
      loadLatestBlogPostsSafely(3),
      publicContentApi.listTestimonials(6),
    ]);
    return res.render('users/company/about-company', {
      services,
      latestBlogPosts,
      testimonials,
    });
  } catch (error) {
    return next(error);
  }
};
