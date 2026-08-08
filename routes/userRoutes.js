const express = require("express");
const router = express.Router();
const isLoggedIn = require("../middlewares/isLoggedIn");

router.get("/profile", isLoggedIn, (req, res) => {
  res.json({
    message: "Welcome user",
    success: true,
    user: req.user,
  });
});

module.exports = router;
