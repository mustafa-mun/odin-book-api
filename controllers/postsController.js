const User = require("../models/user");
const UserProfile = require("../models/profile");
const Post = require("../models/post");
const PostLike = require("../models/post_like"); // This can go into it's own controller 'likeController'

exports.get_timeline_posts = async (req, res, next) => {
  res.json({ message: "NOT IMPLEMENTED: Get timeline posts" });
};

exports.get_post = async (req, res, next) => {
  res.json({ message: "NOT IMPLEMENTED: Get user post" });
};

exports.create_post = async (req, res, next) => {
  res.json({ message: "NOT IMPLEMENTED: Create post" });
};

exports.update_post = async (req, res, next) => {
  res.json({ message: "NOT IMPLEMENTED: Update post" });
};

exports.delete_post = async (req, res, next) => {
  res.json({ message: "NOT IMPLEMENTED: Delete post" });
};
