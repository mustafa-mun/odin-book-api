const User = require("../models/user");
const UserProfile = require("../models/profile");
const FriendRequest = require("../models/friend_request");

exports.get_users = async (req, res, next) => {
  /**
   * THIS REQUEST CAN BE REMOVED
   */
  try {
    const users = await User.find({})
      .populate("profile") // populate the profile field
      .populate({
        path: "friends", // specify the friends field
        populate: {
          // populate the User documents within the friends array
          path: "profile",
        },
      });
    return res.status(200).json({ users });
  } catch (error) {
    return res.status(400).json({ error });
  }
};
// GET USER PROFILE
exports.get_user_profile = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.userId).populate("profile"); // populate the profile field

    // Check if user is found on database
    if (!user) {
      // User is not found
      return res.status(404).json({ error: "User not found!" });
    }
    // User is found, return the user profile
    return res.status(200).json({ profile: user.profile });
  } catch (error) {
    // return next(error);
    return res.status(400).json({ error });
  }
};
// GET FRIEND REQUEST
exports.get_friend_request = (req, res, next) => {
  res.json({ message: "NOT IMPLEMENTED: GET FRIEND REQUEST" });
};
// SEND FRIEND REQUEST
exports.post_send_friend_request = (req, res, next) => {
  res.json({ message: "NOT IMPLEMENTED: SEND FRIEND REQUEST" });
};
// RESPOND TO FRIEND REQUEST
exports.post_respond_to_friend_request = (req, res, next) => {
  res.json({ message: "NOT IMPLEMENTED: ACCEPT OR REJECT FRIEND REQUEST" });
};
// DELETE FRIEND REQUEST
exports.delete_friend_request = (req, res, next) => {
  res.json({ message: "NOT IMPLEMENTED: DELETE FRIEND REQUEST" });
};
