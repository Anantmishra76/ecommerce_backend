const express = require("express");
const router = express.Router();
const isLoggedIn = require("../middlewares/isLoggedIn");
const {
  getWishlist,
  addToWishlist,
  removefromWishlist,
} = require("../controllers/WishlistController");

router.get("/", isLoggedIn, getWishlist);
router.post("/add/:productId", isLoggedIn, addToWishlist);
router.delete("/remove/:productId", isLoggedIn, removefromWishlist);
