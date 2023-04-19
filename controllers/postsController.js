// This unused variables are undirectly being used for database populating
const User = require("../models/user");
const PostLike = require("../models/post_like");
const Comment = require("../models/comment");

const UserProfile = require("../models/profile");
const Post = require("../models/post");
const { body, validationResult } = require("express-validator");

exports.get_timeline_posts = async (req, res, next) => {
  res.json({ message: "NOT IMPLEMENTED: Get timeline posts" });
};

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
  // Validate and sanitaze fields
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
      const postFields = {
        author: req.jwt_token.user.id,
        content: req.body.content,
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

exports.update_post = async (req, res, next) => {
  res.json({ message: "NOT IMPLEMENTED: Update post" });
};

exports.delete_post = async (req, res, next) => {
  res.json({ message: "NOT IMPLEMENTED: Delete post" });
};
