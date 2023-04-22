const Post = require("../models/post-models/post");
const User = require("../models/user-models/user");

/**
 * WHAT IS GOING TO BE IMPLEMENTED :
 * /**
 * WHAT IS GOING TO BE IMPLEMENTED :
 *  - A query parameter url for sorting posts with date (/posts?sort=like&order=asc) (ascending and descending )
 *  - A query parameter url for sorting posts with like (/posts?sort=like&order=asc) (ascending and descending )
 *  - A query parameter url for limiting posts (/posts?limit=10)
 *  - Show users and his friends posts
 *      . Posts should display content, author, comments and likes
 *      . Sort comments from newest to oldest
 *  - Show random friend suggestions
 *      . If they are not friends already
 *      . There must be a some sort of link or redirection to send friend request
 */

exports.get_timeline = async (req, res, next) => {
  try {
    // Find user
    const user = await User.findById(req.jwt_token.user.id).select("friends");
    const friendIds = [user._id, ...user.friends];
    // Find users and friends post
    const posts = await Post.find({ author: { $in: friendIds } })
      .select("-updated_at")
      .populate({
        path: "author",
        select: "first_name last_name",
      });
    return res.json({ posts });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};
