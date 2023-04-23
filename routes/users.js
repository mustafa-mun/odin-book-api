const express = require("express");
const router = express.Router();

const userController = require("../controllers/user/userController");
const profileController = require("../controllers/user/profileController");
const authController = require("../controllers/user/authController");

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - first_name
 *         - last_name
 *         - username
 *         - password
 *         - friends
 *         - profile
 *         - register_date
 *         - is_admin
 *       properties:
 *         _id:
 *            type: string
 *            description: The auto-generated id of the user
 *         first_name:
 *            type: string
 *            description: First name of the user
 *         last_name:
 *           type: string
 *           description: Last name of the user
 *         username:
 *           type: string
 *           description: Username of the user
 *         password:
 *           type: string
 *           description: Password of the user
 *         friends:
 *           type: array
 *           description: Users friends
 *         register_date:
 *           type: date
 *           description: Users registeration date
 *         is_admin:
 *           type: boolean
 *           description: The adminship status of the user
 *       example:
 *         _id: 61711b9febe15e7d61ec0b0c
 *         first_name: Kyle
 *         last_name: Smith
 *         username: adminuser
 *         password: $%a1BcD2eFgH4iJkL6mNoP8qRsT0uVxYz#
 *         friends: [64415e7e9bc167304ede6913, 644413fcef7e69bb972f28c1, 64441a806c7ed38f21f1637f]
 *         register_date: 2023-04-22T17:33:52.359+00:00
 *         is_admin: false
 *
 *     Profile:
 *       type: object
 *       required:
 *         - user
 *         - profile_picture
 *         - about
 *         - posts
 *       properties:
 *         _id:
 *            type: string
 *            description: The auto-generated id of the user
 *         user:
 *            type: objectid
 *            description: The owner of profile
 *         profile_picture:
 *           type: string
 *           description: Profile picture url of user
 *         about:
 *           type: string
 *           description: User about me field
 *         posts:
 *           type: array
 *           description: Array of users posts
 *       example:
 *         _id: 61711b9febe15e7d61ec0b0c
 *         user: 64415e7e9bc167304ede6913
 *         profile_picture: https://www.nicepng.com/png/detail/933-9332131_profile-picture-default
 *         about: About Me
 *         posts: [64415e7e9bc167304ede6913, 644413fcef7e69bb972f28c1, 64441a806c7ed38f21f1637f]
 *
 *     Friend_request:
 *       type: object
 *       required:
 *         - from_user
 *         - to_user
 *         - created_at
 *         - is_accepted
 *       properties:
 *         _id:
 *            type: string
 *            description: The auto-generated id of the blacklisted token
 *         from_user:
 *            type: objectid
 *            description: User that sent the friend request
 *         to_user:
 *            type: objectid
 *            description: User that received the friend request
 *         created_at:
 *            type: date
 *            description: Creation the of the friend request
 *         is_accepted:
 *            type: boolean
 *            description: Acception status of the friend request
 *       example:
 *         _id: 85676b9febe16j9d61ec0b0d
 *         from_user: 64401c7782caf1d22fd50e99
 *         to_user: 64415e7e9bc167304ede6913
 *         created_at: 2023-04-22T08:53:38.393+00:00
 *         is_accepted: false
 *
 *     BlacklistedToken:
 *       type: object
 *       required:
 *         - blacklisted_token
 *       properties:
 *         _id:
 *            type: string
 *            description: The auto-generated id of the blacklisted token
 *         blacklisted_token:
 *            type: string
 *            description: Blacklisted Token
 *       example:
 *         _id: 85676b9febe16j9d61ec0b0d
 *         blacklisted_token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c
 *   securitySchemes:
 *     BearerAuth:
 *       type: http
 *       scheme: bearer
 *       description: JWT authorization token
 */

// GET ALL USERS
router.get("/", authController.authenticateToken, userController.get_all_users);

// GET USER PROFILE
router.get(
  "/:userId/profile",
  authController.authenticateToken,
  profileController.get_user_profile
);
// UPDATE USER PASSWORD
router.put(
  "/:userId/password",
  authController.authenticateToken,
  profileController.update_password
);
// UPDATE PROFILE PICTURE
router.put(
  "/:userId/profile-picture",
  authController.authenticateToken,
  profileController.update_profile_picture
);
// UPDATE PROFILE PICTURE
router.put(
  "/:userId/about-me",
  authController.authenticateToken,
  profileController.update_about_me
);
// GET USERS FRIENDS
router.get(
  "/:userId/friends",
  authController.authenticateToken,
  userController.get_user_friends
);
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
