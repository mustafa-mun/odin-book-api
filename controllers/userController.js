const User = require("../models/user");
const UserProfile = require("../models/profile");
const FriendRequest = require("../models/friend_request");

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
      // Save user on database
      const result = await request.save();
      const savedRequest = await FriendRequest.findById(result._id)
        .populate("from_user", "first_name last_name")
        .populate("to_user", "first_name last_name");

      if (!result) {
        // User not found
        return res.status(404).json({ error: "User not found!" });
      }
      // Return saved friend request
      return res.status(200).json({ friend_request: savedRequest });
    }
    // There are already a friend request or user is trying to send request to himself
    return res.status(403).json({
      error:
        "There is already a request or you are trying to send friend request to yourself!",
    });
  } catch (error) {
    return res.status(400).json({ error });
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
    );
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
    return res.status(400).json({ error });
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
    return res.status(400).json({ error });
  }
};
