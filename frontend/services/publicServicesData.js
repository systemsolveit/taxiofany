const servicesApi = require('./servicesApi');
const { asArray, warnDev } = require('./apiListUtils');

/**
 * Published-only services for public marketing pages (user API enforces isPublished).
 */
async function listPublishedServicesForPublic() {
  try {
    const raw = await servicesApi.listServices();
    return asArray(raw);
  } catch (error) {
    warnDev('publicServices', error);
    return [];
  }
}

module.exports = {
  listPublishedServicesForPublic,
};
