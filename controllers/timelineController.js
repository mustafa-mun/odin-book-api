const Post = require("../models/post-models/post");
const User = require("../models/user-models/user");

exports.get_timeline = async (req, res, next) => {
  try {
    // Find user
    const user = await User.findById(req.jwt_token.user.id).select("friends");
    // User and friends ids
    const friendIds = [user._id, ...user.friends];
    // Find users and friends post
    const posts = await Post.find({ author: { $in: friendIds } })
      .select("-updated_at")
      .populate({
        path: "author",
        select: "first_name last_name",
      });
    // Find users that not friends with current user
    const friendRecommendations = await User.find({
      _id: { $nin: friendIds },
    })
      .select("first_name last_name") // Include only 'first name' and 'last name' fields
      .limit(5); // Limit with 5

    // Add friend request route for each of the recommendations
    const mapFriendRequest = friendRecommendations.map((friend) => {
      return {
        ...friend.toObject(),
        send_friend_request: `POST /users/friend-request/${friend._id}`,
      };
    });
    // Return posts and friend recommendations
    return res.json({
      posts,
      friend_recommendations: mapFriendRequest,
    });
  } catch (error) {
    return res.status(400).json({
      error: error.message,
    });
  }
};
