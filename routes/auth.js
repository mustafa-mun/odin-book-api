const express = require("express");
const router = express.Router();

/**
 * @swagger
 * /auth/signup:
 *   post:
 *     summary: Creates a new user account
 *     description: Use this endpoint to create a new user account with the given details.
 *     tags:
 *       - Auth
 *     produces:
 *       - application/json
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
 *         description: The created user
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
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
 */

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Log in to user accont
 *     description: Use this endpoint to log in to a user account with username and password.
 *     tags:
 *       - Auth
 *     produces:
 *       - application/json
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
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
 *         description: The logged in user and a jwt token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *                 token:
 *                   type: string
 *                   description: The access token.
 *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c
 *       400:
 *          description: Invalid input data
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  error:
 *                    type: string
 *                    description: A message describing the error.
 */

/**
 * @swagger
 * /auth/logout:
 *   post:
 *     summary: Log out a user and blacklist their authentication token
 *     tags:
 *       - Auth
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Blacklisted token successfully saved to database
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 result:
 *                   $ref: '#/components/schemas/BlacklistedToken'
 *       400:
 *         description: Invalid request or server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *       401:
 *         description: Unauthorized
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
 *
 */

const authController = require("../controllers/user/authController");

// POST SIGN UP
router.post("/signup", authController.post_signup);
// POST LOGIN
router.post("/login", authController.post_login);
// POST LOGOUT
router.post(
  "/logout",
  authController.authenticateToken,
  authController.post_logout
);

module.exports = router;
