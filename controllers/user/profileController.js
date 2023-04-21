const User = require("../../models/user-models/user");
const UserProfile = require("../../models/user-models/profile");

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
