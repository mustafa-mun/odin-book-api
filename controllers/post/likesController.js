const Post = require("../../models/post-models/post");
const PostLike = require("../../models/post-models/post_like");
const CommentLike = require("../../models/comment-models/comment_like");

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
  return res.json({ message: "NOT IMPLEMENTED: LIKE POST" });
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
