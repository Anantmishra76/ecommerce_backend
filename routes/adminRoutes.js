const express = require("express");
const router = express.Router();
const isLoggedIn = require("../middlewares/isLoggedIn");
const isAdmin = require("../middlewares/isAdmin");
const { getAdminDashboard } = require("../controllers/adminController");

router.get("/", isLoggedIn, isAdmin, getAdminDashboard);

module.exports = router;
