const express = require("express");
const router = express.Router();
//@route get api/post/test
//@desc test user route
//access public
router.get("/test", (req, res) => {
  res.json({ msg: "user works" });
});

module.exports = router;
