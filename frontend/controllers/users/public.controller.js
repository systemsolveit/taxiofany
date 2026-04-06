const { loadPublicFleetData, splitCarsForPricingTabs } = require('../../services/publicFleetData');

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

    const { cars, drivers } = await loadPublicFleetData();
    const pricingTabs = splitCarsForPricingTabs(cars, 3);

    return res.render('users/home/index', {
      cars,
      drivers,
      pricingTabs,
    });
  } catch (error) {
    return next(error);
  }
};

exports.modernHome = async (req, res, next) => {
  try {
    const { cars, drivers } = await loadPublicFleetData();
    const pricingTabs = splitCarsForPricingTabs(cars, 3);
    return res.render('users/home/modern', {
      cars,
      drivers,
      pricingTabs,
    });
  } catch (error) {
    return next(error);
  }
};

exports.packages = (req, res) => {
  res.render('users/packages/index', {
    pageTitle: 'Packages',
    message: 'Packages page placeholder.',
  });
};

exports.solutions = (req, res) => {
  res.render('users/solutions/index', {
    pageTitle: 'Solutions',
    message: 'Solutions page placeholder.',
  });
};
