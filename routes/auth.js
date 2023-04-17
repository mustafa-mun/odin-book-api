const express = require("express");
const router = express.Router();
/**
 * IMPLEMENT FACEBOOK LOGIN !!!
 */
const authController = require("../controllers/authController");

router.post("/signup", authController.post_signup);
router.post("/login", authController.post_login);
router.post(
  "/logout",
  authController.authenticateToken,
  authController.post_logout
);

module.exports = router;
