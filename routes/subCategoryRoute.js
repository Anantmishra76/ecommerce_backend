const express = require("express");
const router = express.Router();
const {
  getAllSubcategories,
  getSubcategoryByID,
  createSubcategory,
  updateSubcategory,
  deleteSubcategory,
} = require("../controllers/subcategoryController");

const isLoggedIn = require("../middlewares/isLoggedIn");
const isAdmin = require("../middlewares/isAdmin");

// Public
router.get("/", getAllSubcategories);
router.get("/:id", getSubcategoryByID);

// Admin Only
router.post("/create", isLoggedIn, isAdmin, createSubcategory);
router.put("/update/:id", isLoggedIn, isAdmin, updateSubcategory);
router.delete("/delete/:id", isLoggedIn, isAdmin, deleteSubcategory);

module.exports = router;