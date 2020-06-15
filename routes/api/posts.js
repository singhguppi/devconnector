const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const passport = require("passport");
//Post model
const Post = require("../../models/post");

//Profile model

const Profile = require("../../models/Profile");
//validation

validatePostInput = require("../../validation/post");

//@route get api/post/test
//@desc test post route
//access public
router.get("/test", (req, res) => {
  res.json({ msg: "posts works" });
});

//@route Get api/post
//@desc  Get posts
//access Public

router.get("/", (req, res) => {
  Post.find()
    .sort({ date: -1 })
    .then(posts => {
      res.json(posts);
    })
    .catch(err => {
      res.status(404).json({ nopostsfound: "No posts found" });
    });
});

//@route Get api/posts/:id
//@desc  Get post by id
//access Public

router.get("/:id", (req, res) => {
  Post.findById(req.params.id)
    .then(post => res.json(post))
    .catch(err => {
      res.status(404).json({ nopostfound: "No post found with that id" });
    });
});

//@route Post api/post
//@desc  Create post
//access Private

router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { errors, isValid } = validatePostInput(req.body);

    if (!isValid) {
      res.status(400).json(errors);
    }
    const newPost = new Post({
      text: req.body.text,
      name: req.body.name,
      avatar: req.body.avatar,
      user: req.user.id
    });
    newPost.save().then(post => res.json(post));
  }
);

//@route Delete api/post/:id
//@desc  Delete post
//access Private

router.delete(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Profile.findOne({ user: req.user.id }).then(profile => {
      Post.findById(req.params.id).then(post => {
        //check for post owner
        if (post.user.toString() !== req.user.id) {
          return res.status(401).json({ notauthorized: "User not authorized" });
        }

        //Delete
        post
          .remove()
          .then(() => res.json({ success: true }))
          .catch(err => {
            res.status(404).json({ postnotfound: "No post found" });
          });
      });
    });
  }
);

//@route Post api/post/like/:id
//@desc  Like post
//access Private

router.post(
  "/like/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Profile.findOne({ user: req.user.id }).then(profile => {
      Post.findById(req.params.id).then(post => {
        if (
          post.likes.filter(like => like.user.toString() === req.user.id)
            .length > 0
        ) {
          return res
            .status(400)
            .json({ alreadyliked: "user already liked this post" });
        }
        // Add the user id to liked array

        post.likes.unshift({ user: req.user.id });
        post
          .save()
          .then(post => {
            return res.json(post);
          })
          .catch(err => {
            return res.status(404).json({ postnotfound: "No post found" });
          });
      });
    });
  }
);

//@route Post api/post/unlike/:id
//@desc  Unlike post
//access Private

router.post(
  "/unlike/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Profile.findOne({ user: req.user.id }).then(profile => {
      Post.findById(req.params.id).then(post => {
        if (
          post.likes.filter(like => like.user.toString() === req.user.id)
            .length === 0
        ) {
          return res
            .status(400)
            .json({ notliked: "You have not yet liked this post" });
        }
        // Get the remove index

        const removeIndex = post.likes
          .map(item => item.user.toString())
          .indexOf(req.user.id);
        //spice out of array

        post.likes.splice(removeIndex, 1);

        //save
        post
          .save()
          .then(post => {
            res.json(post);
          })

          .catch(err => {
            return res.status(404).json({ postnotfound: "No post found" });
          });
      });
    });
  }
);

//@route Post api/post/comment/:id
//@desc  Add comment to post
//access Private

router.post(
  "/comment/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { errors, isValid } = validatePostInput(req.body);

    if (!isValid) {
      res.status(400).json(errors);
    }
    Post.findById(req.params.id).then(post => {
      const newComment = {
        text: req.body.text,
        name: req.body.name,
        avatar: req.body.avatar,
        user: req.user.id
      };
      //Add comment to array

      post.comments.unshift(newComment);
      post
        .save()
        .then(post => {
          return res.json(post);
        })
        .catch(err => {
          res.status(404).json({ postnotfound: "No post found" });
        });
    });
  }
);

//@route Delete api/posts/comment/:id/:comment:id
//@desc  Remove comment from post
//access Private

router.delete(
  "/comment/:id/:comment_id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Post.findById(req.params.id)
      .then(post => {
        // Check to see if comment exists
        if (
          post.comments.filter(
            comment => comment._id.toString() === req.params.comment_id
          ).length === 0
        ) {
          return res
            .status(404)
            .json({ commentnotexists: "Comment does not exist" });
        }

        // Get remove index
        const removeIndex = post.comments
          .map(item => item._id.toString())
          .indexOf(req.params.comment_id);

        // Splice comment out of array
        post.comments.splice(removeIndex, 1);

        post.save().then(post => res.json(post));
      })
      .catch(err => res.status(404).json({ postnotfound: "No post found" }));
  }
);

module.exports = router;
