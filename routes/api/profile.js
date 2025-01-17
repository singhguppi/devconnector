const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const passport = require("passport");

// Load validation

const validateProfileInput = require("../../validation/profile");
const validateExperienceInput = require("../../validation/experience");
const validateEducationInput = require("../../validation/education");
// Load profile models
const Profile = require("../../models/Profile");

//Load user model

const User = require("../../models/User");

//@route get api/profile/test
//@desc test profile route
//access public
router.get("/test", (req, res) => {
  res.json({ msg: "profile works" });
});

//@route get api/profile
//@desc get current user profile
//access private

router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const errors = {};
    Profile.findOne({ user: req.user.id })
      .populate("user", ["name", "avatar"])
      .then(profile => {
        if (!profile) {
          errors.noprofile = "There is no profile for this user";
          return res.status(404).json(errors);
        }
        res.json(profile);
      })
      .catch(err => res.status(404).json(err));
  }
);

//@route Get api/profile/all
//@desc  Get all profile
//access Public

router.get("/all", (req, res) => {
  const errors = {};
  Profile.find()
    .populate("user", ["name", "avatar"])
    .then(profiles => {
      if (!profiles) {
        errors.noprofile = "There are no profiles";
        res.status(404).json();
      }
      res.json(profiles);
    })
    .catch(err => {});
});

//@route Get api/profile/handle/:handle
//@desc  Get profile by handle
//access Public

router.get("/handle/:handle", (req, res) => {
  const errors = {};
  Profile.findOne({ handle: req.params.handle })
    .populate("user", ["name", "avatar"])
    .then(profile => {
      if (!profile) {
        errors.noprofile = "There is no profile for this handle";
        res.status(404).json(errors);
      }
      res.json(profile);
    })
    .catch(err => {
      res.status(404).json(err);
    });
});

//@route Get api/profile/user/:user_id
//@desc  Get profile by userID
//access Public

router.get("/user/:user_id", (req, res) => {
  const errors = {};
  Profile.findOne({ user: req.params.user_id })
    .populate("user", ["name", "avatar"])
    .then(profile => {
      if (!profile) {
        errors.noprofile = "There is no profile for this handle";
        res.status(404).json(errors);
      }
      res.json(profile);
    })
    .catch(err => {
      res.status(404).json({ profile: "there is no profile for this user" });
    });
});
//@route post api/profile
//@desc  Create or edit user profile
//access Private

router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { errors, isValid } = validateProfileInput(req.body);
    if (!isValid) {
      //return error with 400 status

      return res.status(400).json(errors);
    }
    // Get fields
    const profileFields = {};
    profileFields.user = req.user.id;
    if (req.body.handle) profileFields.handle = req.body.handle;
    if (req.body.company) profileFields.company = req.body.company;
    if (req.body.website) profileFields.website = req.body.website;
    if (req.body.location) profileFields.location = req.body.location;
    if (req.body.bio) profileFields.bio = req.body.bio;

    if (req.body.status) profileFields.status = req.body.status;
    if (req.body.githubusername)
      profileFields.githubusername = req.body.githubusername;

    // skills - split into an array
    if (typeof req.body.skills != "undefined") {
      profileFields.skills = req.body.skills.split(",");
    }
    // social
    profileFields.social = {};
    if (req.body.youtube) profileFields.social.youtube = req.body.youtube;
    if (req.body.twitter) profileFields.social.twitter = req.body.twitter;
    if (req.body.facebook) profileFields.social.facebook = req.body.facebook;
    if (req.body.linkedin) profileFields.social.linkedin = req.body.linkedin;
    if (req.body.instagram) profileFields.social.instagram = req.body.instagram;

    Profile.findOne({ user: req.user.id }).then(profile => {
      if (profile) {
        //update
        Profile.findOneAndUpdate(
          { user: req.user.id },
          { $set: profileFields },
          { new: true }
        ).then(profile => res.json(profile));
      } else {
        //create

        //check if handle exists

        Profile.findOne({ handel: profileFields.handle }).then(profile => {
          if (profile) {
            errors.handle = "handle already exists";
            res.status(400).json(errors);
          }
          // save profile

          new Profile(profileFields).save().then(profile => {
            res.json(profile);
          });
        });
      }
    });
  }
);

//@route post api/profile/experience
//@desc  Add experience to profile
//access Private

router.post(
  "/experience",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { errors, isValid } = validateExperienceInput(req.body);
    if (!isValid) {
      //return error with 400 status
      console.log("not valid");
      return res.status(400).json(errors);
    }
    Profile.findOne({ user: req.user.id }).then(profile => {
      console.log("works till here", profile);
      const newExp = {
        title: req.body.title,
        company: req.body.company,
        location: req.body.location,
        from: req.body.from,
        to: req.body.to,
        current: req.body.current,
        description: req.body.description
      };
      console.log("entered data is", newExp);
      // add experience to the array
      profile.experience.unshift(newExp);
      profile
        .save()
        .then(profile => {
          res.json(profile);
        })
        .catch(err => {
          res.json(err);
        });
    });
  }
);

//@route post api/profile/education
//@desc  Add education to profile
//access Private

router.post(
  "/education",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { errors, isValid } = validateEducationInput(req.body);
    if (!isValid) {
      //return error with 400 status
      //console.log("not valid");
      return res.status(400).json(errors);
    }
    Profile.findOne({ user: req.user.id }).then(profile => {
      //console.log("works till here", profile);
      const newEdu = {
        school: req.body.school,
        degree: req.body.degree,
        fieldofstudy: req.body.fieldofstudy,
        from: req.body.from,
        to: req.body.to,
        current: req.body.current,
        description: req.body.description
      };
      //console.log("entered data is", newEdu);
      // add experience to the array
      profile.education.unshift(newEdu);
      profile
        .save()
        .then(profile => {
          res.json(profile);
        })
        .catch(err => {
          res.json(err);
        });
    });
  }
);

//@route Delete api/profile/experience/:exp_id
//@desc  Delete experience from profile
//access Private

router.delete(
  "/experience/:exp_id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Profile.findOne({ user: req.user.id }).then(profile => {
      //Get remove index

      const removeIndex = profile.experience
        .map(item => item.id)
        .indexOf(req.params.exp_id);

      //Splice out of array
      profile.experience.splice(removeIndex, 1);

      //save
      profile
        .save()
        .then(profile => {
          res.json(profile);
        })
        .catch(err => {
          res.json(err);
        });
    });
  }
);

//@route Delete api/profile/education/:edu_id
//@desc  Delete education from profile
//access Private

router.delete(
  "/education/:edu_id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Profile.findOne({ user: req.user.id }).then(profile => {
      //Get remove index

      const removeIndex = profile.education
        .map(item => item.id)
        .indexOf(req.params.exp_id);

      //Splice out of array
      profile.education.splice(removeIndex, 1);

      //save
      profile
        .save()
        .then(profile => {
          res.json(profile);
        })
        .catch(err => {
          res.json(err);
        });
    });
  }
);

//@route Delete api/profile
//@desc  Delete user and profile
//access Private

router.delete(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    User.findOneAndRemove({ user: req.body.id }).then(() => {
      User.findOneAndRemove({ _id: req.body.id }).then(() => {
        res.json({ sucess: true });
      });
    });
  }
);
module.exports = router;
