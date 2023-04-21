// This unused variables are undirectly being used for database populating
const User = require("../../models/user-models/user");
const CommentLike = require("../../models/comment-models/comment_like");

const Post = require("../../models/post-models/post");
const Comment = require("../../models/comment-models/comment");
const he = require("he");
const { body, validationResult } = require("express-validator");

/**
 * WHAT IS GOING TO BE IMPLEMENTED :
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
      // Decode input
      const decodedInput = he.decode(req.body.content);
      const newComment = new Comment({
        author: req.jwt_token.user.id,
        content: decodedInput,
        post: req.params.postId,
      });
      // Save comment on database
      const savedComment = await newComment.save();
      const post = await Post.findById(savedComment.post);
      const comment = await Comment.findById(savedComment._id)
        .select("-updated_at")
        .populate({
          path: "post",
          select: "content",
        })
        .populate({
          path: "author",
          select: "first_name last_name",
        })
        .populate({
          path: "likes",
          select: "user liked_at",
          populate: {
            path: "user",
            select: "first_name last_name",
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
exports.update_comment = [
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

    // Input is valid, try to update comment
    try {
      // Update new comment with input
      const comment = await Comment.findById(req.params.commentId);
      const author = comment.author;
      const user = req.jwt_token.user;

      if (!comment) {
        // Comment not found
        return res.status(404).json({ error: "Comment not found!" });
      }

      if (JSON.stringify(comment.post) !== JSON.stringify(req.params.postId)) {
        // Post has no such a comment
        return res
          .status(404)
          .json({ error: "Comment not belong to this post!" });
      }

      // Check if user is owner of the comment
      if (JSON.stringify(author._id) === JSON.stringify(user.id)) {
        // User is valid
        // Decode the input
        const decodedInput = he.decode(req.body.content);
        const updatedComment = await Comment.findByIdAndUpdate(
          comment._id,
          {
            content: decodedInput,
            updated_at: Date.now(),
          },
          { new: true }
        )
          .select("-created_at")
          .populate({
            path: "post",
            select: "content",
          })
          .populate({
            path: "author",
            select: "first_name last_name",
          })
          .populate({
            path: "likes",
            select: "user liked_at",
            populate: {
              path: "user",
              select: "first_name last_name",
            },
          });
        // Return updated comment
        return res.status(200).json({ updated_comment: updatedComment });
      }

      // User is not the owner of comment
      return res.status(403).json({
        error: "Unauthorized",
        message: "You are not the owner of this comment!",
      });
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  },
];

exports.delete_comment = async (req, res, next) => {
  try {
    // Find comment
    const comment = await Comment.findById(req.params.commentId);
    const user = req.jwt_token.user;
    const author = comment.author;

    if (!comment) {
      // Comment not found
      return res.status(404).json({ error: "Comment not found!" });
    }

    if (JSON.stringify(comment.post) !== JSON.stringify(req.params.postId)) {
      // Post has no such a comment
      return res
        .status(404)
        .json({ error: "Comment not belong to this post!" });
    }

    // Check if user is an admin or comments owner
    if (user.isAdmin || JSON.stringify(author) === JSON.stringify(user.id)) {
      // Delete the comment and return deleted comment
      const deletedComment = await Comment.findByIdAndDelete(comment._id)
        .select("content author")
        .populate({
          path: "author",
          select: "first_name last_name",
        });
      // Remove the deleted comment from the comments array of other posts
      await Post.updateMany(
        { comments: deletedComment._id },
        { $pull: { comments: deletedComment._id } }
      );
      return res.status(200).json({ deleted_comment: deletedComment });
    }

    //  User is not an admin and trying to delete another users comment
    return res.status(403).json({
      error: "Unauthorized",
      message: "You are trying to delete another users post!",
    });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};
