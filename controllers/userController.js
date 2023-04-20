const User = require("../models/user");
const UserProfile = require("../models/profile");
const FriendRequest = require("../models/friend_request");
const bcrypt = require("bcryptjs");
const { body, validationResult } = require("express-validator");

/**
 * WHAT IS GOING TO BE IMPLEMENTED :
 *  - Update user password
 *  - Update user profile picture
 *  - Update user about me
 * WITH THESE CHANGES, PROFILE REQUEST HANDLERS CAN GO INTO ITS OWN CONTROLLER CALLED 'profileController'
 */

// GET ALL USERS

exports.get_all_users = async (req, res, next) => {
  try {
    const users = await User.find({})
      .select("-is_admin -username -password") // Exclude private fields
      .populate({
        // Populate friends array
        path: "friends",
        select: "first_name last_name", // Include only 'first name' and 'last name' fields
      })
      .populate({
        path: "profile", // Populate profile
        select: "profile_picture about", // Include only 'profile picture' and 'about' fields
      });
    // Return users
    return res.status(200).json({ users });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

// GET USER PROFILE
exports.get_user_profile = async (req, res, next) => {
  try {
    const profile = await UserProfile.findOne({
      user: req.params.userId,
    }).populate({
      path: "user",
      select: "first_name last_name posts friends", // include only these fields
      populate: {
        path: "friends", // populate the 'friends' array
        select: "first_name last_name", // include only the 'first_name' and 'last_name' fields of the friends
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

// GET USERS FRIENDS
exports.get_user_friends = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.userId).populate({
      path: "friends",
      select: "first_name last_name",
    });

    if (!user) {
      // User is not found
      return res.status(404).json({ error: "User is not found" });
    }

    return res.status(200).json({ friends: user.friends });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

exports.update_user = [
  body("first_name", "firstname can't be empty")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("last_name", "lastname can't be empty!")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("username", "username must be minimum 5 characters!")
    .trim()
    .isLength({ min: 5 })
    .escape(),
  body("password", "password must be minimum 8 characters!")
    .trim()
    .isLength({ min: 8 })
    .escape(),
  async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      // There are errors
      return res.status(400).json({
        errors: errors.array(),
      });
    }
    // Inputs are valid, update user
    try {
      // Find user
      const user = await User.findById(req.params.userId);

      if (!user) {
        // User is not found
        return res.status(404).json({ error: "User not found!" });
      }

      // Check if user is an admin or trying to update himself
      if (
        req.jwt_token.user.isAdmin ||
        JSON.stringify(user._id) === JSON.stringify(req.jwt_token.user.id)
      ) {
        // User is valid
        // Create a hashed password
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        const updatedUser = {
          first_name: req.body.first_name,
          last_name: req.body.last_name,
          username: req.body.username,
          password: hashedPassword,
        };
        // Update user with new data
        const updateResult = await User.findByIdAndUpdate(
          user._id,
          updatedUser,
          { new: true }
        );
        // Return the updated user
        return res.status(200).json({ updated_user: updateResult });
      } else {
        // User is not an admin and trying to update another user
        return res.status(401).json({
          error: "Unauthorized",
          message: "You are trying to update another user!",
        });
      }
    } catch (error) {
      // Handle duplicate usernames
      if (error.code === 11000 && error.keyValue.username) {
        res.status(400).json({
          error: "Username already exists!",
        });
      } else {
        res.status(400).json({
          error: error.message,
        });
      }
    }
  },
];

exports.delete_user = async (req, res, next) => {
  try {
    // Find user
    const user = await User.findById(req.params.userId);

    if (!user) {
      // User is not found
      return res.status(404).json({ error: "User not found!" });
    }

    // Check if user is an admin or trying to delete himself
    if (
      req.jwt_token.user.isAdmin ||
      JSON.stringify(user._id) === JSON.stringify(req.jwt_token.user.id)
    ) {
      // Delete user and profile from the database
      const deletedUser = await User.findByIdAndDelete(user._id);
      const deletedProfile = await UserProfile.findOneAndDelete({
        user: user._id,
      });
      // Remove the deleted user from the friends array of other users
      await User.updateMany(
        { friends: deletedUser._id },
        { $pull: { friends: deletedUser._id } }
      );

      // Return the deleted user and profile
      return res
        .status(200)
        .json({ deleted_user: deletedUser, deleted_profile: deletedProfile });
    } else {
      // User is not an admin and trying to delete another user
      return res.status(401).json({
        error: "Unauthorized",
        message: "You are trying to delete another user!",
      });
    }
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

// GET FRIEND REQUEST
exports.get_friend_request = async (req, res, next) => {
  try {
    const result = await FriendRequest.findById(req.params.requestId)
      .populate("from_user", "first_name last_name")
      .populate("to_user", "first_name last_name");

    if (!result) {
      // Handle when user couldn't be found
      return res.status(404).json({ error: "Request not found!" });
    }
    // Return the request
    return res.status(200).json({ friend_request: result });
  } catch (error) {
    return res.status(200).json({ error });
  }
};

// SEND FRIEND REQUEST
exports.post_send_friend_request = async (req, res, next) => {
  try {
    const from_user = req.jwt_token.user.id;
    const to_user = req.params.userId;

    const database_from_user = await User.findById(from_user);
    const database_to_user = await User.findById(to_user);
    // Check for duplicate requests
    const checkDuplicate = await FriendRequest.findOne({
      from_user,
      to_user,
    });

    // Check if request is exists or user is trying to send request to himself
    if (!checkDuplicate && from_user !== to_user) {
      // Create new friend request
      const request = new FriendRequest({
        from_user: req.jwt_token.user.id,
        to_user: req.params.userId,
      });

      // Check if users are alreay friends
      if (database_to_user.friends.includes(database_from_user._id)) {
        return res.status(403).json({ error: "Users are already friends!" });
      }
      // Save friend request on database
      const result = await request.save();
      const savedRequest = await FriendRequest.findById(result._id)
        .populate("from_user", "first_name last_name")
        .populate("to_user", "first_name last_name");

      if (!result) {
        // User not found
        return res.status(404).json({ error: "User not found!" });
      }
      // Return saved friend request
      return res.status(201).json({ friend_request: savedRequest });
    }
    // There are already a friend request or user is trying to send request to himself
    return res.status(403).json({
      error:
        "There is already a request or you are trying to send friend request to yourself!",
    });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

// RESPOND TO FRIEND REQUEST
exports.post_respond_to_friend_request = async (req, res, next) => {
  try {
    // Find the request
    const pendingRequest = await FriendRequest.findById(req.params.requestId);

    if (!pendingRequest) {
      // Request is not found
      return res.status(404).json({ error: "Request not found!" });
    }

    const from_user = await User.findById(pendingRequest.from_user._id);
    const to_user = await User.findById(pendingRequest.to_user._id);

    if (JSON.stringify(to_user._id) !== JSON.stringify(req.jwt_token.user.id)) {
      // User is not the target of the request
      return res.status(403).json({
        error:
          "You are not the target of the request, you can't respond to this request!",
      });
    }

    // Delete the request
    const deletedRequest = await FriendRequest.findByIdAndDelete(
      pendingRequest._id
    )
      .populate("from_user", "first_name last_name")
      .populate("to_user", "first_name last_name");
    if (req.body.is_accepted) {
      // Friend request is accepted
      from_user.friends.push(to_user);
      to_user.friends.push(from_user);
      await to_user.save();
      await from_user.save();
      deletedRequest.is_accepted = true;
    } else {
      // Friend request is rejected
      deletedRequest.is_accepted = false;
    }
    // Return deleted request with updated is_accepted status
    return res.status(200).json({ deleted_request: deletedRequest });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

// DELETE FRIEND REQUEST
exports.delete_friend_request = async (req, res, next) => {
  try {
    // Find friend request
    const pendingRequest = await FriendRequest.findById(req.params.requestId);

    if (!pendingRequest) {
      // Friend request couldn't found
      return res.status(404).json({ error: "Friend request not found!" });
    }

    if (
      JSON.stringify(pendingRequest.from_user._id) !==
      JSON.stringify(req.jwt_token.user.id)
    ) {
      // User is trying to delete someone elses friend request
      return res
        .status(403)
        .json({ error: "You are not the owner of this friend request!" });
    }
    // Delete the request from database
    const deletedRequest = await FriendRequest.findByIdAndDelete(
      pendingRequest._id
    );
    // Return the deleted request
    return res.status(200).json({ deleted_request: deletedRequest });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};
