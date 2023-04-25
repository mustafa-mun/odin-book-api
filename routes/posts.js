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
 * @swagger
 * /posts/:
 *   post:
 *     summary: Creates a new post
 *     description: Use this endpoint to create a new post with the given details.
 *     tags:
 *       - Posts
 *     produces:
 *       - application/json
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               content:
 *                 type: string
 *                 description: The body text of the post.
 *                 example: John
 *               post_img:
 *                 type: string
 *                 description: Img of the post (optional).
 *                 example: www.example.com/img/pfaowpomfpo2121
 *     responses:
 *       200:
 *         description: The created post
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 post:
 *                   $ref: '#/components/schemas/Post'
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
 */

/**
 * @swagger
 * /posts/{postId}/:
 *   put:
 *     summary: Update post
 *     security:
 *       - BearerAuth: []
 *     tags:
 *       - Posts
 *     parameters:
 *       - in: path
 *         name: postId
 *         schema:
 *           type: string
 *         required: true
 *         description: The id of the post to update.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               content:
 *                 type: string
 *                 description: The body text of the post.
 *                 example: Hey, let's contact!
 *               post_img:
 *                 type: string
 *                 description: Img of the post (optional).
 *                 example: www.example.com/img/pfaowpomfpo2121
 *     responses:
 *       200:
 *         description: Updated post
 *         content:
 *           application/json:
 *             schema:
 *                type: object
 *                properties:
 *                  updated_post:
 *                    $ref: '#/components/schemas/Post'
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
 *     summary: Deletes a post
 *     security:
 *       - BearerAuth: []
 *     description: Use this endpoint to delete a post.
 *     tags:
 *       - Posts
 *     parameters:
 *       - in: path
 *         name: postId
 *         schema:
 *           type: string
 *         required: true
 *         description: The id of the post to delete.
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: The deleted post
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 deleted_post:
 *                   $ref: '#/components/schemas/Post'
 
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
 *         description: Post not found.
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
 * @swagger
 * /posts/{postId}/comments?sort=like&order=desc:
 *   get:
 *     summary: Get single posts comments (query parameters are optional)
 *     security:
 *       - BearerAuth: []
 *     description: Use this endpoint to get single posts comments (query parameters are optional).
 *     tags:
 *       - Comments
 *     parameters:
 *       - in: path
 *         name: postId
 *         schema:
 *           type: string
 *         required: true
 *         description: The id of the post to get comments.
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Returned comment
 *         content:
 *           application/json:
 *             schema:
 *                type: object
 *                properties:
 *                  comment:
 *                    $ref: '#/components/schemas/Comment'
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
 * /posts/{postId}:
 *   post:
 *     summary: Creates a new comment
 *     description: Use this endpoint to create a new comment with the given details.
 *     tags:
 *       - Comments
 *     produces:
 *       - application/json
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               content:
 *                 type: string
 *                 description: The body text of the post.
 *                 example: Cool post
 *     responses:
 *       200:
 *         description: The created comment
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 comment:
 *                   $ref: '#/components/schemas/Comment'
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
 */

/**
 * @swagger
 * /posts/{postId}/comments/{commentId}:
 *   put:
 *     summary: Update comment
 *     security:
 *       - BearerAuth: []
 *     tags:
 *       - Comments
 *     parameters:
 *       - in: path
 *         name: commentId
 *         schema:
 *           type: string
 *         required: true
 *         description: The id of the comment to update.
 *       - in: path
 *         name: postId
 *         schema:
 *           type: string
 *         required: true
 *         description: The id of the post to update comment.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               content:
 *                 type: string
 *                 description: The body text of the post.
 *                 example: Hey, let's contact!
 *     responses:
 *       200:
 *         description: Updated comment
 *         content:
 *           application/json:
 *             schema:
 *                type: object
 *                properties:
 *                  updated_comment:
 *                    $ref: '#/components/schemas/Comment'
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
 *         description: Comment not found.
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
 *     summary: Deletes a comment
 *     security:
 *       - BearerAuth: []
 *     description: Use this endpoint to delete a comment.
 *     tags:
 *       - Comments
 *     parameters:
 *       - in: path
 *         name: commentId
 *         schema:
 *           type: string
 *         required: true
 *         description: The id of the comment to delete.
 *       - in: path
 *         name: postId
 *         schema:
 *           type: string
 *         required: true
 *         description: The id of the post to delete comment.
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: The deleted comment
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 deleted_comment:
 *                   $ref: '#/components/schemas/Comment'
 
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
 *         description: Post not found.
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
 * @swagger
 * /posts/{postId}/likes:
 *   get:
 *     summary: Get single posts likes (who liked the post)
 *     security:
 *       - BearerAuth: []
 *     description: Use this endpoint to get single posts likes.
 *     tags:
 *       - Likes
 *     parameters:
 *       - in: path
 *         name: postId
 *         schema:
 *           type: string
 *         required: true
 *         description: The id of the post to get likes.
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Array of comments likes
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Post_like'
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
 *         description: Post not found.
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
 * /posts/{postId}/comments/{commentId}/likes:
 *   get:
 *     summary: Get single comments likes (who liked the comment)
 *     security:
 *       - BearerAuth: []
 *     description: Use this endpoint to get single comments likes.
 *     tags:
 *       - Likes
 *     parameters:
 *       - in: path
 *         name: postId
 *         schema:
 *           type: string
 *         required: true
 *         description: The id of the related post to get comment likes.
 *       - in: path
 *         name: commentId
 *         schema:
 *           type: string
 *         required: true
 *         description: The id of the comment to get likes.
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Array of comments likes
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Comment_like'
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
 *         description: Comment not found.
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
 * /posts/{postId}/like:
 *   post:
 *     summary: Like a post
 *     security:
 *       - BearerAuth: []
 *     description: Use this endpoint to like a post.
 *     tags:
 *       - Likes
 *     parameters:
 *       - in: path
 *         name: postId
 *         schema:
 *           type: string
 *         required: true
 *         description: The id of the post to like.
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Returned post like
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 like:
 *                   $ref: '#/components/schemas/Post_like'
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
 *         description: Post not found.
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
 * /posts/{postId}/comments/{commentId}/like:
 *   post:
 *     summary: Like a comment
 *     security:
 *       - BearerAuth: []
 *     description: Use this endpoint to like a comment.
 *     tags:
 *       - Likes
 *     parameters:
 *       - in: path
 *         name: postId
 *         schema:
 *           type: string
 *         required: true
 *         description: The id of the related post to like a comment.
 *       - in: path
 *         name: commentId
 *         schema:
 *           type: string
 *         required: true
 *         description: The id of the comment to like.
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Returned comment like
 *         content:
 *           application/json:
 *             schema:
*               type: object
 *               properties:
 *                 like:
 *                   $ref: '#/components/schemas/Comment_like'
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
 *         description: Comment not found.
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
 * /posts/{postId}/unlike:
 *   put:
 *     summary: Unlike a post
 *     security:
 *       - BearerAuth: []
 *     description: Use this endpoint to unlike a post.
 *     tags:
 *       - Likes
 *     parameters:
 *       - in: path
 *         name: postId
 *         schema:
 *           type: string
 *         required: true
 *         description: The id of the post to unlike.
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Deleted post like
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 deleted_like:
 *                   $ref: '#/components/schemas/Post_like'
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
 *         description: Post not found.
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
 * /posts/{postId}/comments/{commentId}/unlike:
 *   put:
 *     summary: Unlike a comment
 *     security:
 *       - BearerAuth: []
 *     description: Use this endpoint to unlike a comment.
 *     tags:
 *       - Likes
 *     parameters:
 *       - in: path
 *         name: postId
 *         schema:
 *           type: string
 *         required: true
 *         description: The id of the related post to unlike a comment.
 *       - in: path
 *         name: commentId
 *         schema:
 *           type: string
 *         required: true
 *         description: The id of the comment to unlike.
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Deleted comment like
 *         content:
 *           application/json:
 *             schema:
*               type: object
 *               properties:
 *                 deleted_like:
 *                   $ref: '#/components/schemas/Comment_like'
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
 *         description: Comment not found.
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
