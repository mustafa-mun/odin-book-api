const User = require("../../models/user-models/user");
const UserProfile = require("../../models/user-models/profile");
const he = require("he");
const bcryt = require("bcryptjs");
const { body, validationResult } = require("express-validator");

/**
 * WHAT IS GOING TO BE IMPLEMENTED :
 *  - Update user password
 */

// GET USER PROFILE
exports.get_user_profile = async (req, res, next) => {
  try {
    const profile = await UserProfile.findOne({
      user: req.params.userId,
    })
      .populate({
        path: "user",
        select: "first_name last_name posts friends", // include only these fields
        populate: {
          path: "friends", // populate the 'friends' array
          select: "first_name last_name", // include only the 'first_name' and 'last_name' fields of the friends
        },
      })
      .populate({
        path: "posts",
        select: "-author -updated_at",
        populate: {
          path: "comments",
        },
        populate: {
          path: "likes",
        },
      });

    // Check if user is found on database
    if (!profile) {
      // User is not found
      return res.status(404).json({ error: "Profile not found!" });
    }
    // User is found, return the user profile
    return res.status(200).json({ profile });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

// UPDATE PROFILE PICTURE
exports.update_profile_picture = [
  body("profile_picture", "Profile picture has to be a URL!")
    .trim()
    .isURL()
    .escape(),
  async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      // There are errors
      return res.status(400).json({ errors: errors.array() });
    }
    // There are no errors, try to update
    try {
      const profile = await UserProfile.findOne({ user: req.params.userId });
      const user = req.jwt_token.user;

      if (!profile) {
        // Profile not found
        return res.status(404).json({ error: "User not found!" });
      }

      // Check if user is an admin or owner of the profile
      if (
        user.isAdmin ||
        JSON.stringify(user.id) === JSON.stringify(profile.user)
      ) {
        // User is valid, update the profile picture
        // Decode the url from html
        const decodedUrl = he.decode(req.body.profile_picture);
        const updatedPicture = await UserProfile.findByIdAndUpdate(
          profile._id,
          { profile_picture: decodedUrl },
          { new: true }
        ).select("profile_picture"); // Include only profile picture for the returned document
        // Return the updated picture
        return res
          .status(200)
          .json({ updated_profile_picture: updatedPicture });
      }

      // User is not an admin and trying to update another users profile picture
      return res.status(403).json({
        error: "Unauthorized",
        message: "You are not the owner of this profile!",
      });
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  },
];

// UPDATE ABOUT ME
exports.update_about_me = [
  body("about", "About me needs to be between 1 and 150 characters!")
    .trim()
    .isLength({ min: 1, max: 150 }),
  async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      // There are errors
      return res.status(400).json({ errors: errors.array() });
    }
    // There are no errors, try to update
    try {
      // Find the profile
      const profile = await UserProfile.findOne({ user: req.params.userId });
      const user = req.jwt_token.user;

      if (!profile) {
        // Profile not found
        return res.status(404).json({ error: "User not found!" });
      }

      // Check if user is an admin or owner of the profile
      if (
        user.isAdmin ||
        JSON.stringify(user.id) === JSON.stringify(profile.user)
      ) {
        // User is valid, update the about field
        // Decode the input from html
        const decodedInput = he.decode(req.body.about);
        const updatedAbout = await UserProfile.findByIdAndUpdate(
          profile._id,
          { about: decodedInput },
          { new: true }
        ).select("about"); // Include only about for the returned document
        // Return the updated picture
        return res
          .status(200)
          .json({ updated_about: updatedAbout });
      }

      // User is not an admin and trying to update another users about me
      return res.status(403).json({
        error: "Unauthorized",
        message: "You are not the owner of this profile!",
      });
    } catch (error) {}
  },
];

// UPDATE PASSWORD
exports.update_password = [];
