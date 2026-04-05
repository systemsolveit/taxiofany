const { body } = require('express-validator');

const mailSettingsValidation = [
  body('smtpHost').optional({ checkFalsy: true }).isString().trim(),
  body('smtpPort').optional().isInt({ min: 1, max: 65535 }).withMessage('smtpPort must be a valid port number.'),
  body('smtpSecure').optional().isBoolean().withMessage('smtpSecure must be a boolean.'),
  body('smtpUser').optional({ checkFalsy: true }).isString().trim(),
  body('smtpPass').optional({ checkFalsy: true }).isString(),
  body('smtpFrom').optional({ checkFalsy: true }).isEmail().withMessage('smtpFrom must be a valid email.'),
  body('contactRecipientEmail').optional({ checkFalsy: true }).isEmail().withMessage('contactRecipientEmail must be a valid email.'),
];

const siteSettingsValidation = [
  body('primaryColor')
    .optional({ checkFalsy: true })
    .matches(/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/)
    .withMessage('primaryColor must be a valid hex color.'),
  body('navbarMenu').optional().isArray().withMessage('navbarMenu must be an array.'),
  body('navbarMenu.*.key').optional({ checkFalsy: true }).isString().trim(),
  body('navbarMenu.*.label').optional({ checkFalsy: true }).isString().trim(),
  body('navbarMenu.*.url').optional({ checkFalsy: true }).isString().trim(),
  body('navbarMenu.*.enabled').optional().isBoolean().withMessage('navbarMenu item enabled must be a boolean.'),
  body('pages').optional().isArray().withMessage('pages must be an array.'),
  body('pages.*.key').optional({ checkFalsy: true }).isString().trim(),
  body('pages.*.title').optional({ checkFalsy: true }).isString().trim(),
  body('pages.*.path').optional({ checkFalsy: true }).isString().trim(),
  body('pages.*.enabled').optional().isBoolean().withMessage('pages item enabled must be a boolean.'),
  body('header').optional().isObject().withMessage('header must be an object.'),
  body('header.topLinks').optional().isArray().withMessage('header.topLinks must be an array.'),
  body('header.topLinks.*.key').optional({ checkFalsy: true }).isString().trim(),
  body('header.topLinks.*.label').optional({ checkFalsy: true }).isString().trim(),
  body('header.topLinks.*.url').optional({ checkFalsy: true }).isString().trim(),
  body('header.topLinks.*.enabled').optional().isBoolean().withMessage('header.topLinks item enabled must be a boolean.'),
  body('header.phone').optional({ checkFalsy: true }).isString().trim(),
  body('header.email').optional({ checkFalsy: true }).isString().trim(),
  body('header.location').optional({ checkFalsy: true }).isString().trim(),
  body('header.socialLinks').optional().isArray().withMessage('header.socialLinks must be an array.'),
  body('header.socialLinks.*.key').optional({ checkFalsy: true }).isString().trim(),
  body('header.socialLinks.*.iconClass').optional({ checkFalsy: true }).isString().trim(),
  body('header.socialLinks.*.url').optional({ checkFalsy: true }).isString().trim(),
  body('header.socialLinks.*.enabled').optional().isBoolean().withMessage('header.socialLinks item enabled must be a boolean.'),
  body('header.navButtonLabel').optional({ checkFalsy: true }).isString().trim(),
  body('header.navButtonUrl').optional({ checkFalsy: true }).isString().trim(),
];

module.exports = {
  mailSettingsValidation,
  siteSettingsValidation,
};
