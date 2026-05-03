/**
 * URLs hidden from the primary public navbar (available from the logged-in user menu instead).
 * Presentation-only; does not change CMS-stored settings.
 */
const EXACT_PATHS = new Set(['/404']);

const PREFIXES = ['/account', '/bookings', '/emails', '/profile', '/drivers'];

function normalizePath(url) {
  const raw = String(url || '').trim();
  if (!raw) {
    return '';
  }
  try {
    const u = raw.startsWith('http') ? new URL(raw) : new URL(raw, 'http://local');
    return u.pathname.replace(/\/+$/, '') || '/';
  } catch (e) {
    return raw.split('?')[0].replace(/\/+$/, '') || '/';
  }
}

function isHiddenFromMainNav(url) {
  const path = normalizePath(url);
  if (!path || path === '/') {
    return false;
  }
  if (EXACT_PATHS.has(path)) {
    return true;
  }
  return PREFIXES.some((prefix) => path === prefix || path.startsWith(`${prefix}/`));
}

module.exports = {
  isHiddenFromMainNav,
};
