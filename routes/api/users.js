const bcrypt = require('bcryptjs');
const express = require('express');
const gravatar = require('gravatar');
const jwt = require('jsonwebtoken');
const keys = require('../../config/keys');
const passport = require('passport');

// Load routes utils
const STATUS = require('../utils').STATUS_CODES;

// Load Input validation
const ERR = require('../../validation/validation-errors');
const validateRegisterInput = require('../../validation/register');
const validateLoginInput = require('../../validation/register');


// Load User modal
const User = require('../../models/User');

const router = express.Router();

// @route 	GET api/user/test
// @desc 		Test user route
// @access	Public
router.get('/test', (req, res) => res.json({msg: "Users works!"}) );

// @route 	POST api/user/register
// @desc 		Register user
// @access	Public
router.post('/register', (req, res) => {
	
	// check validation
	const {errors, isValid} = validateRegisterInput(req.body);

	if(!isValid){
		return res.status(STATUS.BAD_REQUEST).json(errors);
	};

	// find if email exists
	User.findOne({ email: req.body.email })
			.then(user => {
				if(user){
					errors.email = ERR.EMAIL_DUPLICATE;
					return res.status(STATUS.BAD_REQUEST).json(errors);
				}
				// create a new user
				const {email, name, password } = req.body;

				const avatar = gravatar.url(email, {
					s: '200', // Size
					r: 'pg',  // Rating
					d: 'mm'   // Default
				});
				const newUser = new User({
					name,
					email,
					password,
					avatar
				});

				bcrypt.genSalt(10, (err, salt) => {
					bcrypt.hash(newUser.password, salt, (error, hash)=>{
						if(error) { res.status(STATUS.SERVER_ERROR).json({error}) };

						newUser.password = hash;
						newUser.save()
									 .then(user => res.json(user))
									 .catch(error => res.status(STATUS.SERVER_ERROR).json({error}));
					});
				});
			});

});

// @route 	POST api/user/login
// @desc 		Login User / Returning JWT Token
// @access	Public
router.post('/login', (req, res) => {
	const {email, password} = req.body;

	// check validation
	const {errors, isValid} = validateLoginInput(req.body);

	if(!isValid){
		return res.status(STATUS.BAD_REQUEST).json(errors);
	};


	// Find user by email
	User.findOne({email}).then(user =>{
		if(!user){
			errors.email = ERR.EMAIL_NOTFOUND;
			return res.status(STATUS.NOT_FOUND).json(errors);
		}

		bcrypt.compare(password, user.password)
					.then(isMatch => {
						if(!isMatch){
							errors.password = ERR.PASSWORD_INCORRECT;
							return res.status(STATUS.NOT_FOUND).json(errors);
						}

						const {id, name, avatar} = user;
						const payload = {id, name, avatar};
						// Sign Token
						jwt.sign(payload, keys.secretOrKey, {expiresIn: 3600}, (error, token) => {
							if(error){ return res.status(STATUS.NOT_FOUND).json({error}) }
							
							return res.json({
								success: true, 
								token: 'Bearer ' + token
							});

						});
					})
	});
});

// @route 	GET api/user/current
// @desc 		Return current user
// @access	Private
router.get('/current', passport.authenticate('jwt', {session: false}), (req, res) => {
	const {name, id, email} = req.user;
	return res.json( {name, id, email} );
});

module.exports = router;