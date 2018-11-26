const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');

// Load routes utils
const STATUS = require('../utils').STATUS_CODES;

// Load Input validation
const validatePostInput = require('../../validation/post');
const ERR = require('../../validation/validation-errors');


// Load Models
const Post = require('../../models/Post');
const Profile = require('../../models/Profile');

const router = express.Router();

// @route 	GET api/posts/test
// @desc 		Test posts route
// @access	Public
router.get('/test', (req, res) => res.json({ msg: "Posts works!" }));

// @route 	Get api/posts
// @desc 		Get posts
// @access	Public
router.get('/', (req, res) => {
  Post.find()
    .sort({ data: -1 })
    .then(posts => res.json(posts))
    .catch(errors => res.status(STATUS.NOT_FOUND).json({ nopostfound: ERR.POSTS_NOTFOUND }));
});

// @route 	Get api/posts/:id
// @desc 		Get post by id
// @access	Public
router.get('/:id', (req, res) => {
  const { id } = req.params;

  Post.findById(id)
    .sort({ data: -1 })
    .then(post => res.json(post))
    .catch(errors => res.status(STATUS.NOT_FOUND).json({ nopostfound: ERR.POST_NOTFOUND }));
});

// @route 	Post api/posts
// @desc 		Create post
// @access	Private
router.post('/', passport.authenticate('jwt', { session: false }), (req, res) => {
  const { errors, isValid } = validatePostInput(req.body);

  if (!isValid) {
    // if any errors, send 400 with errors object
    return res.status(STATUS.BAD_REQUEST).json(errors);
  }
  const { avatar, name, text } = req.body;
  const { id } = req.user;

  const newPost = new Post({
    avatar,
    name,
    text,
    user: id,
  });

  newPost.save().then(post => res.json(post));
});

// @route 	Delete api/posts/:id
// @desc 		delete post by id
// @access	Private
router.delete('/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
  const { id: userid } = req.user;
  const { id: postid } = req.params;

  Profile.findOne({ user: userid })
    .then(profile => {
      Post.findById(postid)
        .then(post => {
          // check if post owner
          if (post.user.toString() !== userid) {
            return res.status(STATUS.NO_AUTH).json({ notauthorized: ERR.USER_NOAUTH });
          }

          // delete
          post.remove()
            .then(() => res.json({ success: true }))
            .catch(errors => res.status(ERR.NOTFOUND).json({ nopostfound: ERR.POST_NOTFOUND }));
        })
        .catch(errors => res.status(STATUS.NOT_FOUND).json({ usernotfound: ERR.USER_NOTFOUND }));
    })
});

// @route 	Post api/posts/like/:id
// @desc 		Like a post
// @access	Private
router.post('/like/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
  const { id: userid } = req.user;
  const { id: postid } = req.params;

  Profile.findOne({ user: userid })
    .then(profile => {
      Post.findById(postid)
        .then(post => {
          // check if user already liked
          const isLiked = (post.likes.filter(like => like.user.toString() === userid)).length > 0;
          if (isLiked) {
            return res.status(STATUS.BAD_REQUEST).json({ alreadyliked: ERR.ALREADY_LIKED });
          }

          // Add user id to likes array
          post.likes.unshift({ user: userid });

          post.save().then(post => res.json(post));
        }).catch(errors => { res.status(STATUS.NOT_FOUND).json({ errors: errors.message }) });
    }).catch(errors => { res.status(STATUS.NOT_FOUND).json({ usernotfound: ERR.USER_NOTFOUND }) });
});

// @route 	Post api/posts/unlike/:id
// @desc 		Unlike a post
// @access	Private
router.post('/unlike/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
  const { id: userid } = req.user;
  const { id: postid } = req.params;

  Profile.findOne({ user: userid })
    .then(profile => {
      Post.findById(postid)
        .then(post => {
          // check if user already liked
          const isLiked = (post.likes.filter(like => like.user.toString() === userid)).length > 0;
          if (!isLiked) {
            return res.status(STATUS.BAD_REQUEST).json({ notliked: ERR.NOT_LIKED });
          }

          // get like index
          const removeIndex = post.likes
            .map(like => like.user.toString())
            .indexOf(userid);

          // Splice out of array
          post.likes.splice(removeIndex, 1);

          post.save().then(post => res.json(post));
        })
        .catch(errors => res.status(STATUS.NOT_FOUND).json({ errors: errors.message }));
    }).catch(errors => { res.status(STATUS.NOT_FOUND).json({ usernotfound: ERR.USER_NOTFOUND }) });
});

// @route 	Post api/posts/comment/:id
// @desc 		Comment on a post
// @access	Private
router.post('/comment/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
  const { errors, isValid } = validatePostInput(req.body);

  if (!isValid) {
    // if any errors, send 400 with errors object
    return res.status(STATUS.BAD_REQUEST).json(errors);
  }

  const { id: userid } = req.user;
  const { id: postid } = req.params;

  Post.findById(postid)
    .then(post => {
      const { avatar, name, text } = req.body;
      const newComment = {
        avatar,
        name,
        text,
        user: userid,
      }

      // add new comment
      post.comments.unshift(newComment);

      // save
      post.save().then(post => res.json(post))
        .catch(errors => res.status(STATUS.BAD_REQUEST).json({ errors: errors.message }));
    }).catch(errors => { res.status(STATUS.NOT_FOUND).json({ errors: errors.message }) });
});

// @route 	Delete api/posts/comment/:id/:comment_id
// @desc 		Delete a comment on a post
// @access	Private
router.delete('/comment/:id/:comment_id', passport.authenticate('jwt', { session: false }), (req, res) => {
  const { id: userid } = req.user;
  const { id: postid, comment_id } = req.params;

  Post.findById(postid)
    .then(post => {
      // check if comment exists
      const commentExists = post.comments.filter(comment => comment._id.toString() === comment_id) > 0;
      if (commentExists) {
        return res.status(STATUS.NOT_FOUND).json({ nopostfound: ERR.POSTS_NOTFOUND });
      }
      // get remove index
      const removeIndex = post.comments
        .map(comment => comment._id.toString())
        .indexOf(comment_id);

      // Splice comment out of array
      post.comments.splice(removeIndex, 1);

      // Save
      post.save().then(post => res.json(post));
    }).catch(errors => { res.status(STATUS.NOT_FOUND).json({ errors: errors.message }) });
});

module.exports = router;