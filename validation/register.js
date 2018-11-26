const Validator = require('validator');
const isEmpty = require('./is-empty');
const ERR = require('./validation-errors');

const validateRegisterInput = (data) => {
	// get form fields
	const name = !isEmpty(data.name) ? data.name : '';
	const email = !isEmpty(data.email) ? data.email : '';
	const password = !isEmpty(data.password) ? data.password : '';
	const password2 = !isEmpty(data.password2) ? data.password2 : '';
	
	const errors = {};

	// User name validations
	if(!Validator.isLength(name, {min: ERR.NAME_MIN, max: ERR.NAME_MAX})){
		errors.name = ERR.NAME_LENGTH;
	}

	if(Validator.isEmpty(name)){
		errors.name = ERR.NAME_REQUIRED;
	}

	// Email validations
	if(Validator.isEmpty(email)){
		errors.email = ERR.EMAIL_REQUIRED;
	}

	if(!Validator.isEmail(email)){
		errors.email = ERR.EMAIL_FORMAT;
	}

	// Password validations
	if(Validator.isEmpty(password)){
		errors.password = ERR.PASSWORD_REQUIRED;
	}

	if(!Validator.isLength(password, {min: ERR.PASSWORD_MIN, MAX: ERR.PASSWORD_MAX})){
		errors.password = ERR.PASSWORD_LENGTH;
	}

	if(Validator.isEmpty(password2)){
		errors.password2 = ERR.PASSWORD2_REQUIRED;
	}

	if(!Validator.equals(password, password2)){
		errors.password2 = ERR.PASSWORD2_MATCH;
	}

	return {
		errors,
		isValid: isEmpty(errors)
	};
}

module.exports = validateRegisterInput;