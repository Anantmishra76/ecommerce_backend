const express = require("express");
const router = express.Router();

const {
  addToCart,
  fetchCart,
  updateCart,
  removeFromCart,
} = require("../controllers/cartController");
const isLoggedIn = require("../middlewares/isloggedin");

router.get("/", isLoggedIn, fetchCart);
router.post("/add", isLoggedIn, addToCart);
router.put("/update/:productId", isLoggedIn, updateCart);
router.delete("/remove/:productId", isLoggedIn, removeFromCart);

module.exports = router;
