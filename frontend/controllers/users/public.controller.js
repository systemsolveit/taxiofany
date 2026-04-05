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

exports.home = (req, res) => {
  const siteSettings = res.locals && res.locals.siteSettings ? res.locals.siteSettings : {};
  const navbarMenu = Array.isArray(siteSettings.navbarMenu) ? siteSettings.navbarMenu : [];
  const homeEnabled = Boolean(getEnabledMenuItemByKey(navbarMenu, 'home'));
  const modernHome = getEnabledMenuItemByKey(navbarMenu, 'home-modern');

  if (!homeEnabled && modernHome && modernHome.url) {
    return res.redirect(toLocalizedPath(res, modernHome.url));
  }

  return res.render('users/home/index');
};

exports.modernHome = (req, res) => {
  res.render('users/home/modern');
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
