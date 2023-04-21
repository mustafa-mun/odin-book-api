const Post = require("../../models/post-models/post");
const Comment = require("../../models/comment-models/comment");

/**
 * WHAT IS GOING TO BE IMPLEMENTED :
 *  - Get single posts comments
 *  - Comment to a post (POST REQUEST)
 *  - Update a comment
 *  - Delete a comment
 */
exports.get_post_comments = async (req, res, next) => {
  res.json({ message: "NOT IMPLEMENTED: GET POST COMMENTS" });
};

exports.create_comment = async (req, res, next) => {
  res.json({ message: "NOT IMPLEMENTED: CREATE COMMENT" });
};

exports.update_comment = async (req, res, next) => {
  res.json({ message: "NOT IMPLEMENTED: UPDATE COMMENT" });
};

exports.delete_comment = async (req, res, next) => {
  res.json({ message: "NOT IMPLEMENTED: DELETE COMMENT" });
};
