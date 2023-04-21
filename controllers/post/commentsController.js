const Post = require("../../models/post-models/post");
const Comment = require("../../models/comment-models/comment");
const CommentLike = require("../../models/comment-models/comment_like");
const { body, validationResult } = require("express-validator");

/**
 * WHAT IS GOING TO BE IMPLEMENTED :
 *  - Get single posts comments
 *  - Comment to a post (POST REQUEST)
 *  - Update a comment
 *  - Delete a comment
 */
exports.get_post_comments = async (req, res, next) => {
  try {
    // Find all comments
    const comments = await Comment.find({ post: req.params.postId })
      .select("-post")
      .populate({
        path: "author",
        select: "first_name last_name",
      })
      .populate({
        path: "likes",
        select: "author content likes",
        populate: {
          path: "author",
          select: "first_name last_name",
        },
      });

    if (!comments) {
      // Post not found
      return res.status(404).json({ error: "Post not found!" });
    }
    // Return comments
    return res.status(200).json({ comments });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

exports.create_comment = [
  body("content", "Comment body should be between 1 and 1000")
    .trim()
    .isLength({ min: 1, max: 1000 })
    .escape(),
  async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      // There are errors
      return res.status(400).json({ errors: errors.array() });
    }

    // Input is valid, try to create comment
    try {
      // Create new comment with input
      const newComment = new Comment({
        author: req.jwt_token.user.id,
        content: req.body.content,
        post: req.params.postId,
      });
      // Save comment on database
      const savedComment = await newComment.save();
      const post = await Post.findById(savedComment.post);
      const comment = await Comment.findById(savedComment._id).populate({
        path: "post",
        select: "content",
        populate: {
          path: "comments",
          select: "author content likes",
          populate: {
            path: "author",
            select: "first_name last_name",
          },
        },
        populate: {
          path: "likes",
          select: "author content likes",
          populate: {
            path: "author",
            select: "first_name last_name",
          },
        },
      });
      post.comments.push(savedComment);
      await post.save();
      // Return saved comment
      return res.status(200).json({ comment });
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  },
];
exports.update_comment = async (req, res, next) => {
  res.json({ message: "NOT IMPLEMENTED: UPDATE COMMENT" });
};

exports.delete_comment = async (req, res, next) => {
  res.json({ message: "NOT IMPLEMENTED: DELETE COMMENT" });
};
