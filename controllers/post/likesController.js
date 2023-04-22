const Post = require("../../models/post-models/post");
const PostLike = require("../../models/post-models/post_like");
const CommentLike = require("../../models/comment-models/comment_like");
const User = require("../../models/user-models/user");

/**
 * WHAT IS GOING TO BE IMPLEMENTED :
 *  - Get post likes
 *  - Get comment likes
 *  - Like comment
 *  - LIke post
 *  - Unlike comment like
 *  - Unlike post like
 */

exports.get_post_likes = async (req, res, next) => {
  return res.json({ message: "NOT IMPLEMENTED: GET POST LIKES" });
};

exports.get_comment_likes = async (req, res, next) => {
  return res.json({ message: "NOT IMPLEMENTED: GET COMMENT LIKES" });
};

exports.like_post = async (req, res, next) => {
  try {
    // Find post
    const post = await Post.findById(req.params.postId);
    // Check if user is already liked this post
    const likedAlready = await PostLike.findOne({
      user: req.jwt_token.user.id,
      post: req.params.postId,
    });

    if (!post) {
      // Post not found
      return res.status(404).json({ error: "Post not found!" });
    }

    if (likedAlready) {
      // User already liked this post
      return res.status(400).json({ error: "You already liked this post!" });
    }

    // Create new post like
    const like = new PostLike({
      user: req.jwt_token.user.id,
      post: req.params.postId,
    });
    // Save like on database
    const savedLike = await like.save();
    // Add like to posts likes array and save post on database
    const populatedLike = await PostLike.findById(savedLike._id).populate({
      path: "post", // Populate post field
      select: "content like_count", // Include only 'content' and 'like count'
    });
    populatedLike.like_count += 1; // This is for return document
    post.likes.push(savedLike);
    post.like_count += 1; // This is for database
    await post.save();
    // Return saved and populated like
    return res.status(200).json({ like: populatedLike });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

exports.like_comment = async (req, res, next) => {
  return res.json({ message: "NOT IMPLEMENTED: LIKE COMMENT" });
};

exports.unlike_post = async (req, res, next) => {
  return res.json({ message: "NOT IMPLEMENTED: UNLIKE POST" });
};

exports.unlike_comment = async (req, res, next) => {
  return res.json({ message: "NOT IMPLEMENTED: UNLIKE COMMENT" });
};
