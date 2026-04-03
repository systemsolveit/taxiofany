const { param } = require('express-validator');

const dictionaryLocaleValidation = [
  param('locale').isIn(['en', 'nl']).withMessage('locale must be one of: en, nl.'),
];

module.exports = {
  dictionaryLocaleValidation,
};