const express = require("express");
const router = express.Router();

const userController = require("../controllers/user/userController");
const authController = require("../controllers/user/authController");
const user = require("../models/user");

// GET ALL USERS
router.get("/", userController.get_all_users);

// GET USER PROFILE
router.get("/:userId", userController.get_user_profile);
// GET USERS FRIENDS
router.get("/:userId/friends", userController.get_user_friends);
// UPDATE USER
router.put(
  "/:userId",
  authController.authenticateToken,
  userController.update_user
);
// DELETE USER
router.delete(
  "/:userId",
  authController.authenticateToken,
  userController.delete_user
);
// SEND FRIEND REQUEST
router.post(
  "/friend-request/:userId",
  authController.authenticateToken,
  userController.post_send_friend_request
);
// GET FRIEND REQUEST(READ)
router.get(
  "/friend-request/:requestId",
  authController.authenticateToken,
  userController.get_friend_request
);
// RESPOND TO A FRIEND REQUEST
router.put(
  "/friend-request/:requestId",
  authController.authenticateToken,
  userController.post_respond_to_friend_request
);
// DELETE A FRIEND REQUEST THAT HAS BEEN PENDING
router.delete(
  "/friend-request/:requestId",
  authController.authenticateToken,
  userController.delete_friend_request
);

module.exports = router;
