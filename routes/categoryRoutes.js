const express = require("express");
const router = express.Router();
const { createCategory } = require("../controllers/categoryController");

const isLoggedIn = require("../middlewares/isLoggedIn");
const isAdmin = require("../middlewares/isAdmin");

// Admin Only
router.post("/", isLoggedIn, isAdmin, createCategory);

module.exports = router;
