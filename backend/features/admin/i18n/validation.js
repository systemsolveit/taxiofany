const { body, query } = require('express-validator');

const supportedLocales = ['en', 'nl'];

const getEntriesValidation = [
  query('locale')
    .optional()
    .isIn(supportedLocales)
    .withMessage('locale must be one of: en, nl.'),
];

const extractKeywordsValidation = [
  query('limit')
    .optional()
    .isInt({ min: 1, max: 500 })
    .withMessage('limit must be an integer between 1 and 500.'),
];

const translateKeywordsValidation = [
  body('texts').isArray({ min: 1 }).withMessage('texts must be a non-empty array.'),
  body('texts.*').isString().trim().notEmpty().withMessage('texts must contain non-empty strings.'),
  body('source')
    .optional()
    .isIn(supportedLocales)
    .withMessage('source must be one of: en, nl.'),
  body('target')
    .optional()
    .isIn(supportedLocales)
    .withMessage('target must be one of: en, nl.'),
];

const saveEntryValidation = [
  body('locale')
    .isIn(supportedLocales)
    .withMessage('locale must be one of: en, nl.'),
  body('key').isString().trim().notEmpty().withMessage('key is required.'),
  body('value').isString().withMessage('value must be a string.'),
];

module.exports = {
  getEntriesValidation,
  extractKeywordsValidation,
  translateKeywordsValidation,
  saveEntryValidation,
};