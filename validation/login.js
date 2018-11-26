const Validator = require('validator');
const isEmpty = require('./is-empty');
const ERR = require('./validation-errors');

const validateLoginInput = (data) => {
  // get form fields
  const email = !isEmpty(data.email) ? data.email : '';
  const password = !isEmpty(data.password) ? data.password : '';

  const errors = {};

  // Email validations
  if (!Validator.isEmail(email)) {
    errors.email = ERR.EMAIL_FORMAT;
  }

  if (Validator.isEmpty(email)) {
    errors.email = ERR.EMAIL_REQUIRED;
  }

  // Password validations
  if (Validator.isEmpty(password)) {
    errors.password = ERR.PASSWORD_REQUIRED;
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
}

module.exports = validateLoginInput;