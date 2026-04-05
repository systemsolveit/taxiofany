const { getSiteSettings } = require('../../admin/settings/service');

async function getPublicSiteSettings(req, res, next) {
  try {
    const data = await getSiteSettings();
    return res.json({
      success: true,
      data: data && data.effective ? data.effective : {},
    });
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  getPublicSiteSettings,
};
