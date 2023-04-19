const express = require("express");
const router = express.Router();

const postsController = require("../controllers/postsController");
const authController = require("../controllers/authController"); // To protect routes

router.get("/", postsController.get_timeline_posts);
router.get("/:postId", postsController.get_post);
router.post("/", authController.authenticateToken, postsController.create_post);
router.put(
  "/:postId",
  authController.authenticateToken,
  postsController.update_post
);
router.delete(
  "/postId",
  authController.authenticateToken,
  postsController.delete_post
);

module.exports = router;
