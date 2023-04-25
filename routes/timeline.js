const express = require("express");
const router = express.Router();

const authController = require("../controllers/user/authController");
const timelineController = require("../controllers/timelineController");

/**
 * @swagger
 * /timeline?sort=date&order=desc&limit=5:
 *   get:
 *     summary: Get timeline (query parameters are optional)
 *     security:
 *       - BearerAuth: []
 *     description: Use this endpoint to get timeline (query parameters are optional).
 *     tags:
 *       - Timeline
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: User and friends posts and 5 friend recommendations
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 posts:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Post'
 *                 friendRecommendations:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       first_name:
 *                         type: string
 *                       last_name:
 *                         type: string
 *                       send_friend_request:
 *                         type: string
 *                     example:
 *                       - first_name: John 
 *                         last_name: Doe
 *                         send_friend_request: POST /users/friend-request/64441a846c7ed38f21f16389
 *                       - first_name: Jane 
 *                         last_name: Smith
 *                         send_friend_request: POST /users/friend-request/64441a856c7ed38f21f1638d
 *                       - first_name: Ellen 
 *                         last_name: Satterfield
 *                         send_friend_request: POST /users/friend-request/64441a866c7ed38f21f16391
 *                       - first_name: Green 
 *                         last_name: Bergstrom
 *                         send_friend_request: POST /users/friend-request/64441a866c7ed38f21f16395
 *                       - first_name: Pedro 
 *                         last_name: Pascal
 *                         send_friend_request: POST /users/friend-request/64441a876c7ed38f21f16399
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

// GET TIMELINE
router.get(
  "/",
  authController.authenticateToken,
  timelineController.get_timeline
);

module.exports = router;
