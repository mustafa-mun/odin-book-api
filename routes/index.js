var express = require("express");
var router = express.Router();

/* GET home page. */
router.get("/", function (req, res, next) {
  res.json({ message: "NOT IMPLEMENTED: API DOCS" });
});

module.exports = router;
