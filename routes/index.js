const express = require("express");
const router = express.Router();

/** 
 * WHAT IS GOING TO BE IMPLEMENTED :
 *  - If user signed in redirect to timeline, otherwise redirect to sign in  
*/

/* GET home page. */
router.get("/", function (req, res, next) {
  res.json({ message: "NOT IMPLEMENTED: API DOCS" });
});

module.exports = router;
