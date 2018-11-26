const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');

// Load routes utils
const STATUS = require('../utils').STATUS_CODES;

// Load Input validation
const validateProfileInput = require('../../validation/profile');
const validateExperienceInput = require('../../validation/experience');
const validateEducationInput = require('../../validation/education');
const ERR = require('../../validation/validation-errors');

// Load Profile Model
const Profile = require('../../models/Profile');
const User = require('../../models/User');

const router = express.Router();

// @route 	GET api/profile/test
// @desc 		Test profile route
// @access	Public
router.get('/test', (req, res) => res.json({
  msg: "Profiles works!"
}));

// @route 	GET api/profile
// @desc 		Get current users profile
// @access	Private
router.get('/', passport.authenticate('jwt', {
  session: false
}), (req, res) => {
  const errors = {};
  Profile.findOne({
      user: req.user.id
    })
    .populate('user', ['name', 'avatar'])
    .then(profile => {
      if (!profile) {
        errors.noprofile = ERR.PROFILE_NOTFOUND;
        return res.status(STATUS.NOT_FOUND).json(errors);
      }
      res.json(profile);
    }).catch(err => res.status(STATUS.NOT_FOUND).json(err));
});

// @route   GET api/profile/handle/:handle
// @desc    Get profile by handle
// @access  Public
router.get('/handle/:handle', (req, res) => {
  const errors = {};
  Profile.findOne({
      handle: req.params.handle
    })
    .populate('user', ['name', 'avatar'])
    .then(profile => {
      if (!profile) {
        errors.noprofile = ERR.PROFILE_NOTFOUND;
        return res.status(STATUS.NOT_FOUND).json(errors);
      }

      res.json(profile);
    }).catch(err => res.status(STATUS.NOT_FOUND).json(err));
});

// @route   GET api/profile/user/:id
// @desc    Get profile by user id
// @access  Public
router.get('/user/:id', (req, res) => {
  const errors = {};
  Profile.findOne({
      user: req.params.id
    })
    .populate('user', ['name', 'avatar'])
    .then(profile => {
      if (!profile) {
        errors.noprofile = ERR.PROFILE_NOTFOUND;
        return res.status(STATUS.NOT_FOUND).json(errors);
      }

      res.json(profile);
    }).catch(err => {
      errors.noprofile = ERR.PROFILE_NOTFOUND;
      res.status(STATUS.NOT_FOUND).json(errors)
    });
});

// @route   DELETE api/profile/
// @desc    Delete user and profile
// @access  Private
router.delete('/', passport.authenticate('jwt', {
  session: false
}), (req, res) => {

  Profile.findOneAndRemove({
      user: req.user.id
    })
    .then(() => {
      User.findOneAndRemove({ _id: req.user.id })
        .then(() => res.json({ success: true }))
    }).catch(errors => res.status(STATUS.SERVER_ERROR).json(errors));
});

// @route   GET api/profile/all
// @desc    Get all profiles
// @access  Public
router.get('/all', (req, res) => {
  const errors = {};
  Profile.find()
    .populate('user', ['name', 'avatar'])
    .then(profiles => {
      if (!profiles) {
        errors.noprofile = ERR.PROFILES_NOTFOUND;
        return res.status(STATUS.NOT_FOUND).json(errors);
      }

      res.json(profiles);
    }).catch(err => {
      errors.noprofile = ERR.PROFILE_NOTFOUND;
      res.status(STATUS.NOT_FOUND).json(errors)
    });
});

// @route 	POST api/profile
// @desc 		Create, or update users profile
// @access	Private
router.post('/', passport.authenticate('jwt', {
  session: false
}), (req, res) => {
  const { errors, isValid } = validateProfileInput(req.body);

  // check validation
  if (!isValid) {
    return res.status(STATUS.BAD_REQUEST).json(errors);
  }
  // get fields
  const profileFields = {};

  // set user
  profileFields.user = req.user.id;

  // check if you could do profileFields.handle = req.body.handle || null
  // const {} = req.body;
  req.body.handle && (profileFields.handle = req.body.handle);
  req.body.company && (profileFields.company = req.body.company);
  req.body.website && (profileFields.website = req.body.website);
  req.body.location && (profileFields.location = req.body.location);
  req.body.bio && (profileFields.bio = req.body.bio);
  req.body.status && (profileFields.status = req.body.status);
  req.body.githubusername && (profileFields.githubusername = req.body.githubusername);
  // Skills - split into an array
  if (typeof req.body.skills !== "undefined") {
    profileFields.skills = req.body.skills.split(',')
  }

  // socials
  profileFields.social = {};
  req.body.youtube && (profileFields.social.youtube = req.body.youtube);
  req.body.twitter && (profileFields.social.twitter = req.body.twitter);
  req.body.facebook && (profileFields.social.facebook = req.body.facebook);
  req.body.instagram && (profileFields.social.instagram = req.body.instagram);

  Profile.findOne({
      user: req.user.id
    })
    .then(profile => {
      if (profile) {
        // update
        Profile.findOneAndUpdate({ user: req.user.id }, { $set: profileFields }, { new: true })
          .then(profile => res.json(profile));
      } else {
        // create

        // Check if handle exists
        Profile.findOne({ handle: profileFields.handle }).then(profile => {
          if (profile) {
            error.handle = ERR.HANDLE_DUPLICATE;
            res.status(STATUS.BAD_REQUEST).json(error);
          }
          // save profile
          new Profile(profileFields).save().then(profile => res.json(profile));
        }).catch(errors => res.status(STATUS.SERVER_ERROR).json(errors));
      }
    }).catch(errors => res.status(STATUS.SERVER_ERROR).json(errors));
});

// @route   POST api/profile/experience
// @desc    Add experience users profile
// @access  Private
router.post('/experience', passport.authenticate('jwt', {
  session: false
}), (req, res) => {
  const { errors, isValid } = validateExperienceInput(req.body);

  // check validation
  if (!isValid) {
    return res.status(STATUS.BAD_REQUEST).json(errors);
  }

  Profile.findOne({
      user: req.user.id
    })
    .then(profile => {
      const {
        title,
        company,
        location,
        from,
        to,
        current,
        description
      } = req.body;

      const newExp = {
        title,
        company,
        location,
        from,
        to,
        current,
        description
      };
      // add to experience array      
      profile.experience.unshift(newExp);

      profile.save().then(profile => res.json(profile));
    }).catch(errors => res.status(STATUS.SERVER_ERROR).json(errors));
});

// @route   DELETE api/profile/experience/:id
// @desc    Remove experience from users profile
// @access  Private
router.delete('/experience/:id', passport.authenticate('jwt', {
  session: false
}), (req, res) => {

  Profile.findOne({
      user: req.user.id
    })
    .then(profile => {
      const removeIndex = profile.experience
        .map(item => item.id)
        .indexOf(req.params.id);

      // splice out of array
      profile.experience.splice(removeIndex, 1);

      // save
      profile.save().then(profile => res.json(profile));
    }).catch(errors => res.status(STATUS.SERVER_ERROR).json(errors));
});

// @route   POST api/profile/education
// @desc    Add education to users profile
// @access  Private
router.post('/education', passport.authenticate('jwt', {
  session: false
}), (req, res) => {
  const { errors, isValid } = validateEducationInput(req.body);

  // check validation
  if (!isValid) {
    return res.status(STATUS.BAD_REQUEST).json(errors);
  }

  Profile.findOne({
      user: req.user.id
    })
    .then(profile => {
      const {
        school,
        degree,
        fieldofstudy,
        from,
        to,
        current,
        description
      } = req.body;

      const newEdu = {
        school,
        degree,
        fieldofstudy,
        from,
        to,
        current,
        description
      };

      // add to education array
      profile.education.unshift(newEdu);

      profile.save().then(profile => res.json(profile));
    }).catch(errors => res.status(STATUS.SERVER_ERROR).json(errors));
});

// @route   DELETE api/profile/education/:id
// @desc    Remove education from users profile
// @access  Private
router.delete('/education/:id', passport.authenticate('jwt', {
  session: false
}), (req, res) => {

  Profile.findOne({
      user: req.user.id
    })
    .then(profile => {
      const removeIndex = profile.education
        .map(item => item.id)
        .indexOf(req.params.id);

      // splice out of array
      profile.education.splice(removeIndex, 1);

      // save
      profile.save().then(profile => res.json(profile));
    }).catch(errors => res.status(STATUS.SERVER_ERROR).json(errors));
});

module.exports = router;