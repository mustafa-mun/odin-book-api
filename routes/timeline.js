const express = require("express");
const router = express.Router();

const authController = require("../controllers/user/authController");
const timelineController = require("../controllers/timelineController");
// GET TIMELINE
router.get(
  "/",
  authController.authenticateToken,
  timelineController.get_timeline
);

module.exports = router;
