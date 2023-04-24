const express = require("express");
const router = express.Router();

const postsController = require("../controllers/post/postsController");
const commentsController = require("../controllers/post/commentsController");
const likesController = require("../controllers/post/likesController");
const authController = require("../controllers/user/authController"); // To protect routes

/**
 * @swagger
 * components:
 *   schemas:
 *     Post:
 *       type: object
 *       required:
 *         - author
 *         - content
 *         - post_img
 *         - created_at
 *         - updated_at
 *         - comments
 *         - likes
 *         - like_count
 *       properties:
 *         _id:
 *            type: string
 *            description: The auto-generated id of the user
 *         author:
 *            type: objectId
 *            description: Id of the posts author
 *         content:
 *           type: string
 *           description: Body text of the post
 *         post_img:
 *           type: string
 *           description: Img of the post(optional)
 *         created_at:
 *           type: date
 *           description: Creation date of the post
 *         updated_at:
 *           type: date
 *           description: Updation date of the post
 *         comments:
 *           type: array
 *           description: Array of comment id's
 *         likes:
 *           type: array
 *           description: Array of like id's
 *         like_count:
 *           type: number
 *           description: Total number of post's like
 *       example:
 *         _id: 61711b9febe15e7d61ec0b0c
 *         author: 64415e7e9bc167304ede6913
 *         content: Hey, how are you guys!
 *         post_img: #
 *         created_at: 2023-04-22T18:36:52.359+00:00
 *         updated_at: 2023-04-22T17:33:52.359+00:00
 *         comments: [611251b9febe15e7d61ec8l80, 617121b9febe15e7d61ec12fas]
 *         likes: [611251b9febe15e7d61ec8l80, 617121b9febe15e7d61ec12fas]
 *         like_count: 29
 *
 *     Post_like:
 *       type: object
 *       required:
 *         - user
 *         - post
 *         - liked_at
 *       properties:
 *         _id:
 *            type: string
 *            description: The auto-generated id of the user
 *         user:
 *            type: objectid
 *            description: The owner of like
 *         post:
 *           type: string
 *           description: The liked post
 *         liked_at:
 *           type: date
 *           description: Like date
 *       example:
 *         _id: 61711b9febe15e7d61ec0b0c
 *         user: 64415e7e9bc167304ede6913
 *         post: 61711b9febe15e7d61ec0b0c
 *         liked_at: 2023-04-22T18:36:52.359+00:00
 *
 *     Comment:
 *       type: object
 *       required:
 *         - author
 *         - content
 *         - post
 *         - created_at
 *         - updated_at
 *         - likes
 *         - like_count
 *       properties:
 *         _id:
 *            type: string
 *            description: The auto-generated id of the user
 *         author:
 *            type: objectId
 *            description: Id of the comments author
 *         content:
 *           type: string
 *           description: Body text of the comment
 *         post:
 *           type: objectId
 *           description: The post the comment was written on
 *         created_at:
 *           type: date
 *           description: Creation date of the comment
 *         updated_at:
 *           type: date
 *           description: Updation date of the comment
 *         likes:
 *           type: array
 *           description: Array of like id's
 *         like_count:
 *           type: number
 *           description: Total number of comment's like
 *       example:
 *         _id: 61711b9febe15e7d61ec0b0c
 *         author: 64415e7e9bc167304ede6913
 *         content: Cool post.
 *         post: 611251b9febe15e7d61ec8l80
 *         created_at: 2023-04-22T18:36:52.359+00:00
 *         updated_at: 2023-04-22T17:33:52.359+00:00
 *         likes: [611251b9febe15e7d61ec8l80, 617121b9febe15e7d61ec12fas]
 *         like_count: 29
 *
 *     Comment_like:
 *       type: object
 *       required:
 *         - user
 *         - comment
 *         - liked_at
 *       properties:
 *         _id:
 *            type: string
 *            description: The auto-generated id of the user
 *         user:
 *            type: objectid
 *            description: The owner of like
 *         comment:
 *           type: string
 *           description: The liked comment
 *         liked_at:
 *           type: date
 *           description: Like date
 *       example:
 *         _id: 61711b9febe15e7d61ec0b0c
 *         user: 64415e7e9bc167304ede6913
 *         comment: 61711b9febe15e7d61ec0b0c
 *         liked_at: 2023-04-22T18:36:52.359+00:00
 */

/**
 * @swagger
 * /posts/{postId}/:
 *   get:
 *     summary: Get post
 *     security:
 *       - BearerAuth: []
 *     description: Use this endpoint to get post.
 *     tags:
 *       - Posts
 *     parameters:
 *       - in: path
 *         name: postId
 *         schema:
 *           type: string
 *         required: true
 *         description: The id of the post to get.
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Returned post
 *         content:
 *           application/json:
 *             schema:
 *                type: object
 *                properties:
 *                  post:
 *                    $ref: '#/components/schemas/Post'
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
router.post(
  "/:postId/like",
  authController.authenticateToken,
  likesController.like_post
);
// LIKE A COMMENT
router.post(
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
