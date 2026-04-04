const { body, param, query } = require('express-validator');
const service = require('./service');

async function assertActiveLocale(value) {
  if (!(await service.isSupportedLocale(value))) {
    throw new Error('locale must reference an active locale.');
  }
  return true;
}

function assertLocaleFormat(value) {
  const normalized = String(value || '').trim().toLowerCase();
  if (!/^[a-z]{2,10}(?:-[a-z0-9]{2,8})?$/i.test(normalized)) {
    throw new Error('locale code format is invalid. Use values like en, nl, fr, or ar-eg.');
  }
  return true;
}

function assertTranslateLocaleFormat(value) {
  const normalized = String(value || '').trim().toLowerCase();
  if (normalized === 'auto') {
    return true;
  }

  if (!/^[a-z]{2,10}(?:-[a-z0-9]{2,8})?$/i.test(normalized)) {
    throw new Error('translation locale format is invalid. Use values like en, nl, fr, ar-eg, or auto.');
  }

  return true;
}

const localeFieldValidation = (fieldName) =>
  body(fieldName)
    .isString()
    .trim()
    .notEmpty()
    .withMessage(`${fieldName} is required.`)
    .bail()
    .custom(assertLocaleFormat);

const getEntriesValidation = [
  query('locale')
    .optional()
    .custom(assertLocaleFormat),
];

const extractKeywordsValidation = [
  query('limit')
    .optional()
    .isInt({ min: 1, max: 5000 })
    .withMessage('limit must be an integer between 1 and 5000.'),
];

const translateKeywordsValidation = [
  body('texts').isArray({ min: 1 }).withMessage('texts must be a non-empty array.'),
  body('texts.*').isString().trim().notEmpty().withMessage('texts must contain non-empty strings.'),
  body('source')
    .optional()
    .custom(assertTranslateLocaleFormat),
  body('target')
    .optional()
    .custom(assertTranslateLocaleFormat),
];

const saveEntryValidation = [
  localeFieldValidation('locale'),
  body('key').isString().trim().notEmpty().withMessage('key is required.'),
  body('value').isString().withMessage('value must be a string.'),
];

const bulkSaveEntriesValidation = [
  localeFieldValidation('locale'),
  body('entries').isArray({ min: 1 }).withMessage('entries must be a non-empty array.'),
  body('entries.*.key').isString().trim().notEmpty().withMessage('each entry key is required.'),
  body('entries.*.value').isString().withMessage('each entry value must be a string.'),
  body('entries.*.file').optional().isString().trim().notEmpty().withMessage('each entry file must be a valid path.'),
  body('entries.*.text').optional().isString().trim().notEmpty().withMessage('each entry text must be a non-empty string.'),
];

const createLocaleValidation = [
  body('code').isString().trim().notEmpty().withMessage('code is required.'),
  body('label').isString().trim().notEmpty().withMessage('label is required.'),
  body('baseLocale').optional().isString().trim().notEmpty().withMessage('baseLocale must be a locale code.'),
  body('isActive').optional().isBoolean().withMessage('isActive must be a boolean.'),
];

const updateLocaleValidation = [
  param('code').isString().trim().notEmpty().withMessage('locale code is required.'),
  body('label').optional().isString().trim().notEmpty().withMessage('label must not be empty.'),
  body('baseLocale').optional().isString().trim().notEmpty().withMessage('baseLocale must be a locale code.'),
  body('isActive').optional().isBoolean().withMessage('isActive must be a boolean.'),
];

module.exports = {
  getEntriesValidation,
  extractKeywordsValidation,
  translateKeywordsValidation,
  saveEntryValidation,
  bulkSaveEntriesValidation,
  createLocaleValidation,
  updateLocaleValidation,
};