const Post = require("../../models/post-models/post");
const PostLike = require("../../models/post-models/post_like");
const CommentLike = require("../../models/comment-models/comment_like");
const Comment = require("../../models/comment-models/comment");
const User = require("../../models/user-models/user");

exports.get_post_likes = async (req, res, next) => {
  try {
    // Find post
    const post = await Post.findById(req.params.postId);

    if (!post) {
      // Post not found
      return res.status(404).json({ error: "Post not found" });
    }
    // Find posts likes
    const postLikes = await PostLike.find({ post: post._id })
      .select("-post") // Exclude 'post'
      .populate({
        path: "user", // Populate user field
        select: "first_name last_name", // Include only 'first name' and 'last name'
      });
    // Return post likes and like count of the post
    return res
      .status(200)
      .json({ likes: postLikes, like_count: post.like_count });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

exports.get_comment_likes = async (req, res, next) => {
  try {
    // Find post
    const comment = await Comment.findById(req.params.commentId);

    if (!comment) {
      // comment not found
      return res.status(404).json({ error: "comment not found" });
    }

    // Check if post has comment with req.params.commentId
    if (JSON.stringify(comment.post) !== JSON.stringify(req.params.postId)) {
      // Post has no such a comment
      return res
        .status(404)
        .json({ error: "Comment not belong to this post!" });
    }
    // Find comments likes
    const commentLikes = await CommentLike.find({ comment: comment._id })
      .select("-comment") // Exclude 'comment'
      .populate({
        path: "user", // Populate user field
        select: "first_name last_name", // Include only 'first name' and 'last name'
      });
    // Return comment likes and like count of the comment
    return res
      .status(200)
      .json({ likes: commentLikes, like_count: comment.like_count });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

exports.like_post = async (req, res, next) => {
  try {
    // Find post
    const post = await Post.findById(req.params.postId);
    // Check if user is already liked this post
    const isLikedAlready = await PostLike.findOne({
      user: req.jwt_token.user.id,
      post: req.params.postId,
    });

    if (!post) {
      // Post not found
      return res.status(404).json({ error: "Post not found!" });
    }

    if (isLikedAlready) {
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
    populatedLike.post.like_count += 1; // This is for return document
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
  try {
    const comment = await Comment.findById(req.params.commentId);
    // Check if user is already liked this comment
    const isLikedAlready = await CommentLike.findOne({
      user: req.jwt_token.user.id,
      comment: req.params.commentId,
    });

    if (!comment) {
      // Comment not found
      return res.status(404).json({ error: "Comment not found!" });
    }

    if (isLikedAlready) {
      // User already liked this comment
      return res.status(400).json({ error: "You already liked this comment!" });
    }

    // Check if post has comment with req.params.commentId
    if (JSON.stringify(comment.post) !== JSON.stringify(req.params.postId)) {
      // Post has no such a comment
      return res
        .status(404)
        .json({ error: "Comment not belong to this post!" });
    }
    // Comment found
    // Create new comment like
    const like = new CommentLike({
      user: req.jwt_token.user.id,
      comment: req.params.commentId,
    });
    // Save like on database
    const savedLike = await like.save();
    // Add like to comments likes array and save comment on database
    const populatedLike = await CommentLike.findById(savedLike._id).populate({
      path: "comment", // Populate comment field
      select: "content like_count", // Include only 'content' and 'like count'
    });
    populatedLike.comment.like_count += 1; // This is for return document
    comment.likes.push(savedLike);
    comment.like_count += 1; // This is for database
    await comment.save();
    // Return saved and populated like
    return res.status(200).json({ like: populatedLike });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

exports.unlike_post = async (req, res, next) => {
  try {
    // Find post
    const post = await Post.findById(req.params.postId);
    // Find posts like
    const like = await PostLike.findOne({
      user: req.jwt_token.user.id,
      post: req.params.postId,
    });

    if (!post) {
      // Post not found
      return res.status(404).json({ error: "Post not found!" });
    }

    if (!like) {
      // Post is not liked
      return res.status(400).json({ error: "Post is not liked!" });
    }

    if (
      JSON.stringify(req.jwt_token.user.id) !== JSON.stringify(like.user._id)
    ) {
      // User is not the owner of like
      return res.status(403).json({
        error: "Unauthorized",
        message: "You are not the owner of this like!",
      });
    }

    // Delete the like
    const deletedPostLike = await PostLike.findByIdAndDelete(like._id)
      .populate({
        path: "user",
        select: "first_name last_name",
      })
      .populate({
        path: "post",
        select: "content like_count",
      });
    // Decrease posts like count by one
    post.like_count -= 1;
    deletedPostLike.post.like_count -= 1; // This is for return document
    // Remove the deleted like from the likes array of other posts
    await Post.updateMany(
      { likes: deletedPostLike._id },
      { $pull: { likes: deletedPostLike._id } }
    );
    // Save post
    await post.save();

    // Return deleted post
    return res.status(200).json({ deleted_like: deletedPostLike });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

exports.unlike_comment = async (req, res, next) => {
  try {
    // Find comment
    const comment = await Comment.findById(req.params.commentId);
    // Find comments like
    const like = await CommentLike.findOne({
      user: req.jwt_token.user.id,
      comment: req.params.commentId,
    });

    if (!comment) {
      // Comment not found
      return res.status(404).json({ error: "Comment not found!" });
    }

    // Check if post has comment with req.params.commentId
    if (JSON.stringify(comment.post) !== JSON.stringify(req.params.postId)) {
      // Post has no such a comment
      return res
        .status(404)
        .json({ error: "Comment not belong to this post!" });
    }

    if (!like) {
      // Comment is not liked
      return res.status(400).json({ error: "Comment is not liked!" });
    }

    if (
      JSON.stringify(req.jwt_token.user.id) !== JSON.stringify(like.user._id)
    ) {
      // User is not the owner of like
      return res.status(403).json({
        error: "Unauthorized",
        message: "You are not the owner of this like!",
      });
    }

    // Delete the like
    const deletedCommentLike = await CommentLike.findByIdAndDelete(like._id)
      .populate({
        path: "user",
        select: "first_name last_name",
      })
      .populate({
        path: "comment",
        select: "content like_count",
      });
    // Decrease comments like count by one
    comment.like_count -= 1;
    deletedCommentLike.comment.like_count -= 1; // This is for return document
    // Remove the deleted like from the likes array of other comments
    await Comment.updateMany(
      { likes: deletedCommentLike._id },
      { $pull: { likes: deletedCommentLike._id } }
    );
    // Save comment
    await comment.save();

    // Return deleted comment
    return res.status(200).json({ deleted_like: deletedCommentLike });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};
