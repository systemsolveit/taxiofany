const { param } = require('express-validator');

const dictionaryLocaleValidation = [
  param('locale')
    .isString()
    .trim()
    .notEmpty()
    .withMessage('locale is required.')
    .bail()
    .matches(/^[a-z]{2,10}(?:-[a-z0-9]{2,8})?$/i)
    .withMessage('locale code format is invalid. Use values like en, nl, fr, or ar-eg.'),
];

module.exports = {
  dictionaryLocaleValidation,
};