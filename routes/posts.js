const express = require("express");
const router = express.Router();

const postsController = require("../controllers/post/postsController");
const commentsController = require("../controllers/post/commentsController");
const authController = require("../controllers/user/authController"); // To protect routes

// GET SINGLE POST
router.get("/:postId", postsController.get_post);
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

module.exports = router;
