const Validator = require('validator');
const isEmpty = require('./is-empty');
const ERR = require('./validation-errors');

const validateExperienceInput = (data) => {
  // get form fields
  const title = !isEmpty(data.title) ? data.title : '';
  const company = !isEmpty(data.company) ? data.company : '';
  const from = !isEmpty(data.from) ? data.from : '';

  const errors = {};

  if (Validator.isEmpty(title)) {
    errors.title = ERR.EXP_TITLE_REQUIRED;
  }

  if (Validator.isEmpty(company)) {
    errors.company = ERR.EXP_COMPANY_REQUIRED;
  }


  if (Validator.isEmpty(from)) {
    errors.from = ERR.FROM_REQUIRED;
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
}

module.exports = validateExperienceInput;