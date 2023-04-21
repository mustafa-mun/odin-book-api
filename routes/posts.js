const express = require("express");
const router = express.Router();

const postsController = require("../controllers/post/postsController");
const commentsController = require("../controllers/post/commentsController");
const likesController = require("../controllers/post/likesController");
const authController = require("../controllers/user/authController"); // To protect routes

/**
 * Posts routes
 */
// GET SINGLE POST
router.get(
  "/:postId",
  authController.authenticateToken,
  postsController.get_post
);
// CREATE NEW POST
router.post("/", authController.authenticateToken, postsController.create_post);
// UPDATE POST
router.put(
  "/:postId",
  authController.authenticateToken,
  postsController.update_post
);
// DELETE POST
router.delete(
  "/:postId",
  authController.authenticateToken,
  postsController.delete_post
);
/**
 * Comment routes
 */
// GET POST COMMENTS
router.get(
  "/:postId/comments",
  authController.authenticateToken,
  commentsController.get_post_comments
);
// CREATE NEW COMMENT
router.post(
  "/:postId",
  authController.authenticateToken,
  commentsController.create_comment
);
// UPDATE COMMENT
router.put(
  "/:postId/comments/:commentId",
  authController.authenticateToken,
  commentsController.update_comment
);
// DELETE COMMENT
router.delete(
  "/:postId/comments/:commentId",
  authController.authenticateToken,
  commentsController.delete_comment
);

/**
 * Like/Unlike routes
 */
// GET POST LIKES
router.get(
  "/:postId/likes",
  authController.authenticateToken,
  likesController.get_post_likes
);
// GET COMMENT LIKES
router.get(
  "/:postId/comments/:commentId/likes",
  authController.authenticateToken,
  likesController.get_comment_likes
);
// LIKE A POST
router.put(
  "/:postId/like",
  authController.authenticateToken,
  likesController.like_post
);
// LIKE A COMMENT
router.put(
  "/:postId/comments/:commentId/like",
  authController.authenticateToken,
  likesController.like_comment
);
// UNLIKE A POST
router.put(
  "/:postId/unlike",
  authController.authenticateToken,
  likesController.unlike_post
);
// UNLIKE A COMMENT
router.put(
  "/:postId/comments/:commentId/unlike",
  authController.authenticateToken,
  likesController.unlike_comment
);
module.exports = router;
