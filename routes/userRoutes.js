const express = require("express");
const router = express.Router();
const isLoggedIn = require("../middlewares/isLoggedIn");
const { getUserProfile } = require("../controllers/userController");

router.get("/profile", isLoggedIn, getUserProfile);

module.exports = router;
