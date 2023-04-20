const express = require("express");
const router = express.Router();
/**
 * IMPLEMENT FACEBOOK LOGIN !!!
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
