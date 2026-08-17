const express = require("express");
const router = express.Router();
const {
  getAllCategories,
  getCategoryByID,
  createCategory,
  updateCategory,
  deleteCategory,
} = require("../controllers/categoryController");

const isLoggedIn = require("../middlewares/isLoggedIn");
const isAdmin = require("../middlewares/isAdmin");

// Public
router.get("/", getAllCategories);
router.get("/:id", getCategoryByID);

// Admin Only
router.post("/create", isLoggedIn, isAdmin, createCategory);
router.put("/update/:id", isLoggedIn, isAdmin, updateCategory);
router.delete("/delete/:id", isLoggedIn, isAdmin, deleteCategory);

module.exports = router;
