const { loadPublicFleetData, splitCarsForPricingTabs } = require('../../services/publicFleetData');
const { listPublishedServicesForPublic } = require('../../services/publicServicesData');
const { sortByLatestCreated, listPublishedBlogPostsForHome } = require('../../services/homeContentData');
const publicContentApi = require('../../services/publicContentApi');

function getEnabledMenuItemByKey(navbarMenu = [], key) {
  return navbarMenu.find((item) => item && item.key === key && item.enabled);
}

function toLocalizedPath(res, path) {
  const normalized = String(path || '/').startsWith('/') ? String(path || '/') : `/${String(path || '/')}`;
  const locale = res.locals && typeof res.locals.locale === 'string' ? res.locals.locale : '';
  if (!locale) {
    return normalized;
  }

  if (normalized === '/') {
    return `/${locale}`;
  }

  return `/${locale}${normalized}`;
}

exports.home = async (req, res, next) => {
  try {
    const siteSettings = res.locals && res.locals.siteSettings ? res.locals.siteSettings : {};
    const navbarMenu = Array.isArray(siteSettings.navbarMenu) ? siteSettings.navbarMenu : [];
    const homeEnabled = Boolean(getEnabledMenuItemByKey(navbarMenu, 'home'));
    const modernHome = getEnabledMenuItemByKey(navbarMenu, 'home-modern');

    if (!homeEnabled && modernHome && modernHome.url) {
      return res.redirect(toLocalizedPath(res, modernHome.url));
    }

    const [fleetData, services, blogPosts, testimonials] = await Promise.all([
      loadPublicFleetData(),
      listPublishedServicesForPublic(),
      listPublishedBlogPostsForHome(3),
      publicContentApi.listTestimonials(6),
    ]);
    const cars = sortByLatestCreated(fleetData.cars);
    const drivers = sortByLatestCreated(fleetData.drivers);
    const servicesSorted = sortByLatestCreated(services);
    const pricingTabs = splitCarsForPricingTabs(cars, 3);

    return res.render('users/home/index', {
      cars,
      drivers,
      services: servicesSorted,
      blogPosts,
      testimonials,
      pricingTabs,
    });
  } catch (error) {
    return next(error);
  }
};

exports.modernHome = async (req, res, next) => {
  try {
    const [fleetData, services, blogPosts, testimonials] = await Promise.all([
      loadPublicFleetData(),
      listPublishedServicesForPublic(),
      listPublishedBlogPostsForHome(3),
      publicContentApi.listTestimonials(6),
    ]);
    const cars = sortByLatestCreated(fleetData.cars);
    const drivers = sortByLatestCreated(fleetData.drivers);
    const servicesSorted = sortByLatestCreated(services);
    const pricingTabs = splitCarsForPricingTabs(cars, 3);
    return res.render('users/home/modern', {
      cars,
      drivers,
      services: servicesSorted,
      blogPosts,
      testimonials,
      pricingTabs,
    });
  } catch (error) {
    return next(error);
  }
};

exports.packages = async (req, res, next) => {
  try {
    const packages = await publicContentApi.listPackages(20);
    return res.render('users/packages/index', {
      pageTitle: res.locals.t ? res.locals.t('pages.users.packages.packages', 'Packages') : 'Packages',
      packages,
    });
  } catch (error) {
    return next(error);
  }
};

exports.solutions = async (req, res, next) => {
  try {
    const [services, packages] = await Promise.all([
      listPublishedServicesForPublic(),
      publicContentApi.listPackages(6),
    ]);
    return res.render('users/solutions/index', {
      pageTitle: res.locals.t ? res.locals.t('pages.users.solutions.solutions', 'Solutions') : 'Solutions',
      services: sortByLatestCreated(services),
      packages,
    });
  } catch (error) {
    return next(error);
  }
};
