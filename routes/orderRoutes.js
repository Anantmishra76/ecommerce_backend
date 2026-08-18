const express = require("express");
const router = express.Router();

const {
  createOrder,
  getMyOrders,
  getOrderById,
  cancelOrder,
  updateOrderStatus,
} = require("../controllers/OrderController");

const isLoggedIn = require("../middlewares/isLoggedIn");
const isAdmin = require("../middlewares/isAdmin");

// User routes
router.post("/create", isLoggedIn, createOrder);
router.get("/", isLoggedIn, getMyOrders);
router.get("/:id", isLoggedIn, getOrderById);
router.put("/cancel/:id", isLoggedIn, cancelOrder);

// Admin route
router.put("/status/:id", isLoggedIn, isAdmin, updateOrderStatus);

module.exports = router;
