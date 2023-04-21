// This unused variables are undirectly being used for database populating
const User = require("../../models/user-models/user");
const PostLike = require("../../models/post-models/post_like");
const Comment = require("../../models/comment-models/comment");

const UserProfile = require("../../models/user-models/profile");
const Post = require("../../models/post-models/post");
const he = require("he");
const { body, validationResult } = require("express-validator");

/**
 * WHAT IS GOING TO BE IMPLEMENTED :
 *  - A query parameter url for sorting posts with date (/posts?sort=date)
 *  - A query parameter url for limiting posts (/posts?limit=10)
 */

exports.get_post = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.postId)
      .populate({
        path: "author",
        select: "first_name last_name",
      })
      .populate("likes")
      .populate("comments");

    if (!post) {
      // Post not found
      return res.status(404).json({ error: "Post not found!" });
    }
    // Return post
    return res.status(200).json({ post });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

exports.create_post = [
  // Validate and sanitize fields
  body("content", "Text can't be empty!").trim().isLength({ min: 1 }).escape(),
  async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      // There are validation errors
      return res.status(400).json({ errors: errors.array() });
    }
    // There are no errors, try to create new post
    try {
      // Create new post with inputs
      // Decode input
      const decodedInput = he.decode(req.body.content);
      const postFields = {
        author: req.jwt_token.user.id,
        content: decodedInput,
      };

      // Include post img only if it exists
      if (req.body.post_img) {
        postFields.post_img = req.body.post_img;
      }
      // Create and save new post
      const newPost = new Post(postFields);
      const savedPost = await newPost.save();

      // Find authors profile and add post to posts array
      const authorProfile = await UserProfile.findOne({
        user: req.jwt_token.user.id,
      });
      authorProfile.posts.push(savedPost);
      await authorProfile.save();

      // Return created post
      return res.status(201).json({ post: savedPost });
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  },
];

exports.update_post = [
  // Validate and sanitize fields
  body("content", "Text can't be empty!").trim().isLength({ min: 1 }).escape(),
  async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      // There are errors
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      // Input data is valid, find post
      const post = await Post.findById(req.params.postId);
      const user = req.jwt_token.user;
      const author = post.author;

      if (!post) {
        // Post is not found
        return res.status(404).json({ error: "Post not found!" });
      }

      // Post found, check if user is owner of the post
      if (
        user.isAdmin ||
        JSON.stringify(author._id) === JSON.stringify(user.id)
      ) {
        // User is valid
        // Decode input
        const decodedInput = he.decode(req.body.content);
        const postFields = {
          content: decodedInput,
          updated_at: Date.now(),
        };

        // Include post img only if it exists
        if (req.body.post_img) {
          postFields.post_img = req.body.post_img;
        }
        // Update post with new input data
        const updatedPost = await Post.findByIdAndUpdate(post._id, postFields, {
          new: true,
        }).populate({
          path: "author",
          select: "first_name last_name",
        });
        // Return updated post
        return res.status(200).json({ updated_post: updatedPost });
      }

      // User is trying to update other users post
      return res.status(401).json({
        error: "Unauthorized",
        message: "You are trying to update another users post!",
      });
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  },
];

exports.delete_post = async (req, res, next) => {
  try {
    // Find post
    const post = await Post.findById(req.params.postId);
    const user = req.jwt_token.user;
    const author = post.author;

    if (!post) {
      // Post not found
      return res.status(404).json({ error: "Post not found!" });
    }

    // Check if user is an admin or posts owner
    if (user.isAdmin || JSON.stringify(author) === JSON.stringify(user.id)) {
      // Delete the post and return deleted post
      const deletedPost = await Post.findByIdAndDelete(post._id).populate({
        path: "author",
        select: "first_name last_name",
      });
      // Remove the deleted post from the posts array of other users
      await UserProfile.updateMany(
        { posts: deletedPost._id },
        { $pull: { posts: deletedPost._id } }
      );
      return res.status(200).json({ deleted_post: deletedPost });
    }

    //  User is not an admin and trying to delete another users post
    return res.status(403).json({
      error: "Unauthorized",
      message: "You are trying to delete another users post!",
    });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};
