const express = require("express");
const router = express.Router();
const isloggedin = require("../middlewares/isloggedin");
const isAdmin = require("../middlewares/isAdmin");

router.get("/", isloggedin, isAdmin, (req, res) => {
  res.json({
    success: true,
    message: "Welcome admin",
    user: req.user,
  });
});

module.exports = router;