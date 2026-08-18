const User = require("../models/usermodel");
const Product = require("../models/Productmodel");
const Order = require("../models/orderModel");

module.exports.getMyOrders = async (req, res) => {
  try {
    const userId = req.user._id;

    const orders = await Order.find({ user: userId })
      .populate("items.product")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      message: "Orders fetched successfully",
      orders,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch orders",
      error: error.message,
    });
  }
};

module.exports.createOrder = async (req, res) => {
  try {
    const userId = req.user._id;

    const { name, contact, address, city, state, pincode } = req.body;

    if (!name || !contact || !address || !city || !state || !pincode) {
      return res.status(400).json({
        success: false,
        message: "All shipping address fields are required",
      });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (!user.cart || user.cart.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Your cart is empty",
      });
    }
    const orderItems = [];
    let totalAmount = 0;

    for (const cartItem of user.cart) {
      const product = await Product.findById(cartItem.product);

      if (!product) {
        return res.status(404).json({
          success: false,
          message: "One of the products in your cart was not found",
        });
      }
      if (product.stock < cartItem.quantity) {
        return res.status(400).json({
          success: false,
          message: `${product.name} does not have enough stock`,
        });
      }

      const itemPrice =
        product.discountedPrice > 0 ? product.discountedPrice : product.price;
      const itemTotal = itemPrice * cartItem.quantity;

      orderItems.push({
        product: product._id,
        quantity: cartItem.quantity,
        price: itemPrice,
      });

      totalAmount += itemTotal;
    }

    const order = await Order.create({
      user: userId,
      items: orderItems,
      totalAmount,

      shippingAddress: {
        name,
        contact,
        address,
        city,
        state,
        pincode,
      },
      paymentStatus: "PENDING",
      orderStatus: "PROCESSING",
    });

    //for Reduce product stock
    for (const cartItem of user.cart) {
      await Product.findByIdAndUpdate(cartItem.product, {
        $inc: {
          stock: -cartItem.quantity,
        },
      });
    }

    //  Add order to user's orders
    user.orders.push(order._id);

    // Clear cart
    user.cart = [];

    await user.save();

    return res.status(201).json({
      success: true,
      message: "Order created successfully",
      order,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to create order",
      error: error.message,
    });
  }
};

module.exports.getOrderById = async (req, res) => {
  try {
    const UserId = req.user._id;
    const orderId = req.params.id;
    const order = await Order.findOne({
      _id: orderId,
      user: UserId,
    }).populate("items.product");
    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found ",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Order fetched successfully",
      order,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch order",
    });
  }
};

module.exports.cancelOrder = async (req, res) => {
  try {
    const UserId = req.user._id;
    const orderId = req.params.id;
    const order = await Order.findOne({
      _id: orderId,
      user: UserId,
    });
    if (!order) {
      return res.status(404).json({
        success: false,
        message: "order not found",
      });
    }
    if (order.orderStatus == "CANCELLED") {
      return res.status(400).json({
        success: false,
        message: "order already cancelled ",
      });
    }

    if (order.orderStatus == "SHIPPED" || order.orderStatus == "DELIVERED") {
      return res.status(400).json({
        success: false,
        message:
          "This order can not cancelled  beacuse orderstatus is shipped or delivered",
      });
    }
    for (const item of order.items) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: {
          stock: item.quantity,
        },
      });
    }

    order.orderStatus = "CANCELLED";
    await order.save();
    return res.status(200).json({
      success: true,
      message: "Order cancelled Successfully",
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Failed to cancel order ",
      error: err.message,
    });
  }
};

module.exports.updateOrderStatus = async (req, res) => {
  try {
    const orderId = req.params.id;
    const { orderStatus } = req.body;
    const validStatuses = ["PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"];
    if (!validStatuses.includes(orderStatus)) {
      return res.status(400).json({
        success: false,
        message: "Invalid order status",
      });
    }

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    order.orderStatus = orderStatus;

    await order.save();
    return res.status(200).json({
      success: true,
      message: "order status updated successfully",
      order,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: " failed to update the order status",
      error: err.message,
    });
  }
};
