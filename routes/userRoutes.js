const express = require("express");
const router = express.Router();
const isloggedin = require("../middlewares/isloggedin");

router.get("/profile", isloggedin, (req, res) => {
  res.json({
    message: "Welcome user",
    success: true,
    user: req.user,
  });
});

module.exports = router;
