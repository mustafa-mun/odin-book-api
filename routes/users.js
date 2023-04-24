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
 *           description: Users id of friends
 *         profile:
 *           type: objectid
 *           description: Users profile id
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
 *         profile: 6441233fklt6e69bb972f12g5
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

/**
 * @swagger
 * /users/:
 *   get:
 *     summary: Get all users
 *     security:
 *       - BearerAuth: []
 *     description: Use this endpoint to get all users.
 *     tags:
 *       - Users
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Array of users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *       401:
 *         description: Unauthorized, take your token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: A message describing the error.
 *       400:
 *         description: Invalid input data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: A message describing the error.
 */

/**
 * @swagger
 * /users/{userId}:
 *   get:
 *     summary: Get user profile
 *     security:
 *       - BearerAuth: []
 *     description: Use this endpoint to get users profile.
 *     tags:
 *       - Users
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: string
 *         required: true
 *         description: The id of the user to get the profile.
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Profile of the user 
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 $ref: '#/components/schemas/Profile'
 *       400:
 *         description: Invalid input data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: A message describing the error.
 *       
 *       403:
 *         description: Forbidden
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: A message describing the error.       
 *       401:
 *         description: Unauthorized, take your token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: A message describing the error.
 *       404:
 *         description: User not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: A message describing the error.       
 */

/**
 * @swagger
 * /users/{userId}/friends:
 *   get:
 *     summary: Get users friends
 *     security:
 *       - BearerAuth: []
 *     description: Use this endpoint to get users friends.
 *     tags:
 *       - Users
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: string
 *         required: true
 *         description: The id of the user to get the friends.
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Array of users friends 
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *       400:
 *         description: Invalid input data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: A message describing the error.
 *       
 *       403:
 *         description: Forbidden
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: A message describing the error.       
 *       401:
 *         description: Unauthorized, take your token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: A message describing the error.
 *       404:
 *         description: User not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: A message describing the error.       
 */

/**
 * @swagger
 * /users/{userId}/password:
 *   put:
 *     summary: Update users password
 *     security:
 *       - BearerAuth: []
 *     tags:
 *       - Users
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: string
 *         required: true
 *         description: The id of the user to change password.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               password:
 *                 type: string
 *                 description: The password of the user.
 *                 example: Sse23124lse!
 *     responses:
 *       200:
 *         description: Updated and hashed password
 *         content:
 *           application/json:
 *             schema:
*                type: object
*                properties:
*                  updated_password:
*                    type: string
*                    example: $2a$10$GwA5bxzWkFOJ4e4Y.4zfR.z2ZdJhVtrILSxxuh.WGRzvkAY3IAtim
 *       400:
 *         description: Bad request.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: A message describing the error.
 *       401:
 *         description: Unauthorized, take your token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: A message describing the error.
 *       404:
 *         description: User not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: A message describing the error.
 * 
 */

/**
 * @swagger
 * /users/{userId}/profile-picture:
 *   put:
 *     summary: Update users profile picture
 *     security:
 *       - BearerAuth: []
 *     tags:
 *       - Users
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: string
 *         required: true
 *         description: The id of the user to change profile picture.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               profile_picture:
 *                 type: string
 *                 description: The profile picture of the user.
 *                 example: Sse23124lse!
 *     responses:
 *       200:
 *         description: Updated profile picture of the user
 *         content:
 *           application/json:
 *             schema:
*                type: object
*                properties:
*                  updated_profile_picture:
*                    type: string
*                    example: https://example.com/photo-1511367461989
 *       400:
 *         description: Bad request.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: A message describing the error.
 *       401:
 *         description: Unauthorized, take your token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: A message describing the error.
 *       404:
 *         description: User not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: A message describing the error.
 * 
 */

/**
 * @swagger
 * /users/{userId}/about-me:
 *   put:
 *     summary: Update users about me
 *     security:
 *       - BearerAuth: []
 *     tags:
 *       - Users
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: string
 *         required: true
 *         description: The id of the user to change about me.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               about:
 *                 type: string
 *                 description: The about me field of the user.
 *                 example: Hey, let's contact!
 *     responses:
 *       200:
 *         description: Updated about me of the user
 *         content:
 *           application/json:
 *             schema:
 *                type: object
 *                properties:
 *                  updated_about_me:
 *                    type: string
 *                    example: Hey, let's contact!
 *       400:
 *         description: Bad request.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: A message describing the error.
 *       404:
 *         description: User not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: A message describing the error.
 * 
 */

/**
 * @swagger
 * /users/{userId}/:
 *   put:
 *     summary: Update user
 *     security:
 *       - BearerAuth: []
 *     tags:
 *       - Users
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: string
 *         required: true
 *         description: The id of the user to update.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               first_name:
 *                 type: string
 *                 description: The first name of the user.
 *                 example: John
 *               last_name:
 *                 type: string
 *                 description: The last name of the user.
 *                 example: Smith
 *               username:
 *                 type: string
 *                 description: The username of the user.
 *                 example: johnsmith
 *               password:
 *                 type: string
 *                 description: The password of the user.
 *                 example: password123
 *     responses:
 *       200:
 *         description: Updated user
 *         content:
 *           application/json:
 *             schema:
 *                type: object
 *                properties:
 *                  updated_user:
 *                    $ref: '#/components/schemas/User'
 *       400:
 *         description: Bad request.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: A message describing the error.
 *       401:
 *         description: Unauthorized, take your token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: A message describing the error.
 *       404:
 *         description: User not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: A message describing the error.
 * 
 *   delete:
 *     summary: Deletes a user
 *     security:
 *       - BearerAuth: []
 *     description: Use this endpoint to delete a user.
 *     tags:
 *       - Users
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: string
 *         required: true
 *         description: The id of the user to delete.
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: The deleted user
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 deleted_user:
 *                   $ref: '#/components/schemas/User'
 
 *       400:
 *         description: Invalid input data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: A message describing the error.
 *       401:
 *         description: Unauthorized, take your token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: A message describing the error.
 *       404:
 *         description: Post or Comment not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: A message describing the error.
 */

/**
 * @swagger
 * /users/friend-request/{userId}:
 *   post:
 *     summary: Send friend requests to a user.
 *     description: Use this endpoint to create a friend request to another user.
 *     tags:
 *       - Friend-requests
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: string
 *         required: true
 *         description: The id of the user send friend request.
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: The created friend request.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 friend_request:
 *                   $ref: '#/components/schemas/Friend_request'
 *       401:
 *         description: Unauthorized, take your token.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: A message describing the error.
 *       400:
 *         description: Invalid input data.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: A message describing the error.
 *       404:
 *         description: User not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: A message describing the error.
 */

/**
 * @swagger
 * /users/friend-request/${requestId}:
 *   get:
 *     summary: Get friend request
 *     security:
 *       - BearerAuth: []
 *     description: Use this endpoint to get read a friend request.
 *     tags:
 *       - Friend-requests
 *     parameters:
 *       - in: path
 *         name: requestId
 *         schema:
 *           type: string
 *         required: true
 *         description: The id of the friend request to get.
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Pending friend request.
 *         content:
 *           application/json:
 *             schema:
 *               properties:
 *                 friend_request:
 *                   $ref: '#/components/schemas/Friend_request'
 *       400:
 *         description: Invalid input data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: A message describing the error.
 *       
 *       403:
 *         description: Forbidden
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: A message describing the error.       
 *       401:
 *         description: Unauthorized, take your token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: A message describing the error.
 *       404:
 *         description: Friend request not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: A message describing the error.       
 */

/**
 * @swagger
 * /users/friend-request/{requestId}:
 *   put:
 *     summary: Respond to a friend request
 *     security:
 *       - BearerAuth: []
 *     tags:
 *       - Friend-requests
 *     parameters:
 *       - in: path
 *         name: requestId
 *         schema:
 *           type: string
 *         required: true
 *         description: The id of the friend request to respond.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               is_accepted:
 *                 type: boolean
 *                 description: The status of acceptance.
 *                 example: true
 *     responses:
 *       200:
 *         description: Resolved friend request
 *         content:
 *           application/json:
 *             schema:
 *                type: object
 *                properties:
 *                  resolved_friend_request:
 *                    $ref: '#/components/schemas/Friend_request'
 *       400:
 *         description: Bad request.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: A message describing the error.
 *       403:
 *         description: Forbidden
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: A message describing the error.       
 *       401:
 *         description: Unauthorized, take your token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: A message describing the error.
 *       404:
 *         description: Friend request not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: A message describing the error.
 * 
 */

/**
 * @swagger
 * /users/friend-request/{requestId}:
 *   delete:
 *     summary: Delete a pending friend request
 *     security:
 *       - BearerAuth: []
 *     tags:
 *       - Friend-requests
 *     parameters:
 *       - in: path
 *         name: requestId
 *         schema:
 *           type: string
 *         required: true
 *         description: The id of the friend request to delete.
 *     responses:
 *       200:
 *         description: Deleted friend request
 *         content:
 *           application/json:
 *             schema:
 *                type: object
 *                properties:
 *                  deleted_friend_request:
 *                    $ref: '#/components/schemas/Friend_request'
 *       400:
 *         description: Bad request.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: A message describing the error.
 *       403:
 *         description: Forbidden
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: A message describing the error.       
 *       401:
 *         description: Unauthorized, take your token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: A message describing the error.
 *       404:
 *         description: Friend request not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: A message describing the error.
 * 
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
// UPDATE ABOUT ME
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
