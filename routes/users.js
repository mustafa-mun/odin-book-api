const express = require("express");
const router = express.Router();

const userController = require("../controllers/userController");
const authController = require("../controllers/authController");

router.get("/:userId", userController.get_user_profile);
router.get("/:userId/friends", userController.get_user_friends);
router.put(
  "/:userId",
  authController.authenticateToken,
  userController.update_user
);
router.delete(
  "/:userId",
  authController.authenticateToken,
  userController.delete_user
);
router.post(
  "/friend-request/:userId",
  authController.authenticateToken,
  userController.post_send_friend_request
);
router.get(
  "/friend-request/:requestId",
  authController.authenticateToken,
  userController.get_friend_request
);
router.put(
  "/friend-request/:requestId",
  authController.authenticateToken,
  userController.post_respond_to_friend_request
);

router.delete(
  "/friend-request/:requestId",
  authController.authenticateToken,
  userController.delete_friend_request
);

module.exports = router;
