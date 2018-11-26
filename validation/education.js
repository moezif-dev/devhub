const Validator = require('validator');
const isEmpty = require('./is-empty');
const ERR = require('./validation-errors');

const validateExperienceInput = (data) => {
  // get form fields
  const school = !isEmpty(data.school) ? data.school : '';
  const degree = !isEmpty(data.degree) ? data.degree : '';
  const fieldOfStudy = !isEmpty(data.fieldofstudy) ? data.fieldofstudy : '';
  const from = !isEmpty(data.from) ? data.from : '';

  const errors = {};

  if (Validator.isEmpty(school)) {
    errors.school = ERR.EDU_SCHOOL_REQUIRED;
  }

  if (Validator.isEmpty(degree)) {
    errors.degree = ERR.EDU_DEGREE_REQUIRED;
  }

  if (Validator.isEmpty(fieldOfStudy)) {
    errors.fieldofstudy = ERR.EDU_STUDY_REQUIRED;
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