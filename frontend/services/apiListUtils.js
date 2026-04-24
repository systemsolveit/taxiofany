/**
 * User API list responses are usually a JSON array; normalize edge cases.
 */
function asArray(data) {
  if (Array.isArray(data)) {
    return data;
  }
  if (data && Array.isArray(data.items)) {
    return data.items;
  }
  if (data && Array.isArray(data.data)) {
    return data.data;
  }
  return [];
}

function warnDev(scope, error) {
  if (process.env.NODE_ENV === 'production') {
    return;
  }
  const msg = error && error.message ? error.message : String(error);
  console.warn(`[${scope}]`, msg);
}

module.exports = {
  asArray,
  warnDev,
};
