const Validator = require('validator');
const isEmpty = require('./is-empty');
const ERR = require('./validation-errors');

const validatePostInput = (data) => {
  // get form fields
  const text = !isEmpty(data.text) ? data.text : '';

  const errors = {};

  // text validations
  if (!Validator.isLength(text, { min: ERR.POST_MIN, max: ERR.POST_MAX })) {
    errors.text = ERR.POST_LENGTH;
  }

  if (Validator.isEmpty(text)) {
    errors.text = ERR.POST_REQUIRED;
  }


  return {
    errors,
    isValid: isEmpty(errors)
  };
}

module.exports = validatePostInput;