const Validator = require('validator');
const isEmpty = require('./is-empty');
const ERR = require('./validation-errors');

const validateProfileInput = (data) => {
  // get form fields
  const handle = !isEmpty(data.handle) ? data.handle : '';
  const status = !isEmpty(data.status) ? data.status : '';
  const skills = !isEmpty(data.skills) ? data.skills : '';

  const facebook = !isEmpty(data.facebook) ? data.facebook : '';
  const instagram = !isEmpty(data.instagram) ? data.instagram : '';
  const linkedin = !isEmpty(data.linkedin) ? data.linkedin : '';
  const website = !isEmpty(data.website) ? data.website : '';
  const youtube = !isEmpty(data.youtube) ? data.youtube : '';

  const errors = {};

  // Handle validations
  if (!Validator.isLength(handle, { min: ERR.HANDLE_MIN, max: ERR.HANDLE_MAX })) {
    errors.handle = ERR.HANDLE_LENGTH;
  }

  if (Validator.isEmpty(handle)) {
    errors.handle = ERR.HANDLE_REQUIRED;
  }

  // Status validations
  if (Validator.isEmpty(status)) {
    errors.status = ERR.STATUS_REQUIRED;
  }


  // Skills validations
  if (Validator.isEmpty(skills)) {
    errors.skills = ERR.SKILLS_REQUIRED;
  }

  // social media validation
  if (!isEmpty(facebook) && !Validator.isURL(facebook)) {
    errors.facebook = ERR.FACEBOOK_FORMAT;
  }

  if (!isEmpty(instagram) && !Validator.isURL(instagram)) {
    errors.instagram = ERR.INSTAGRAM_FORMAT;
  }

  if (!isEmpty(linkedin) && !Validator.isURL(linkedin)) {
    errors.linkedin = ERR.LINKEDIN_FORMAT;
  }

  if (!isEmpty(website) && !Validator.isURL(website)) {
    errors.website = ERR.WEBSITE_FORMAT;
  }

  if (!isEmpty(youtube) && !Validator.isURL(youtube)) {
    errors.youtube = ERR.YOUTUBE_FORMAT;
  }


  return {
    errors,
    isValid: isEmpty(errors)
  };
}

module.exports = validateProfileInput;