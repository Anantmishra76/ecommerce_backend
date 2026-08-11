const express = require("express");
const router = express.Router();
const isLoggedIn = require("../middlewares/isLoggedIn");
const isAdmin = require("../middlewares/isAdmin");
const {
  getAllProduct,
  createProduct,
  getProductById,
  updateProduct,
  deleteProduct,
} = require("../controllers/productController");

router.get("/", getAllProduct);
router.get("/:id", getProductById);

//Admin Only
router.post("/create", isLoggedIn, isAdmin, createProduct);
router.put("/update/:id", isLoggedIn, isAdmin, updateProduct);
router.delete("/delete/:id", isLoggedIn, isAdmin, deleteProduct);

module.exports = router;
