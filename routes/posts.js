const express = require("express");
const router = express.Router();

const postsController = require("../controllers/postsController");
const commentsController = require("../controllers/commentsController");
const authController = require("../controllers/authController"); // To protect routes

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
  "/postId",
  authController.authenticateToken,
  postsController.delete_post
);

module.exports = router;
