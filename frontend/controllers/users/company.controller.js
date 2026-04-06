const { loadPublicFleetData } = require('../../services/publicFleetData');

exports.aboutUs = async (req, res, next) => {
  try {
    const { drivers } = await loadPublicFleetData();
    return res.render('users/company/about-us', { drivers });
  } catch (error) {
    return next(error);
  }
};

exports.aboutCompany = async (req, res, next) => {
  try {
    const { drivers } = await loadPublicFleetData();
    return res.render('users/company/about-company', { drivers });
  } catch (error) {
    return next(error);
  }
};
