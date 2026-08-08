const express = require("express");
const router = express.Router();
const isLoggedIn = require("../middlewares/isLoggedIn");
const isAdmin = require("../middlewares/isAdmin");
const { createProduct } = require("../controllers/productController");

router.get("/", (req, res) => {
  res.send("This is product  route");
});

router.post("/", isLoggedIn, isAdmin, createProduct);

module.exports = router;
