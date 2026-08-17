const User = require("../models/usermodel");
const Product = require("../models/Productmodel");

module.exports.fetchCart = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .select("cart")
      .populate("cart.product");
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found ",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Cart fetched successfully ",
      cart: user.cart,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      message: "Internal server error ",
    });
  }
};

module.exports.addToCart = async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    if (!productId) {
      return res.status(400).json({
        success: false,
        message: "Product ID is required",
      });
    }

    const addQuantity = quantity ?? 1;

    if (!Number.isInteger(addQuantity) || addQuantity <= 0) {
      return res.status(400).json({
        success: false,
        message: "Quantity must be a positive integer",
      });
    }

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const matchingItems = user.cart.filter(
      (item) => item.product.toString() === productId.toString(),
    );

    const existingQuantity = matchingItems.reduce(
      (total, item) => total + item.quantity,
      0,
    );

    const newQuantity = existingQuantity + addQuantity;

    if (newQuantity > product.stock) {
      return res.status(400).json({
        success: false,
        message: `Only ${product.stock - existingQuantity} more item(s) can be added`,
      });
    }

    if (matchingItems.length > 0) {
      const mainItem = matchingItems[0];

      mainItem.quantity = newQuantity;

      user.cart = user.cart.filter(
        (item) =>
          item === mainItem || item.product.toString() !== productId.toString(),
      );
    } else {
      user.cart.push({
        product: productId,
        quantity: addQuantity,
      });
    }

    await user.save();

    await user.populate("cart.product");

    return res.status(200).json({
      success: true,
      message: "Product added to cart successfully",
      cart: user.cart,
    });
  } catch (error) {
    console.error("Add To Cart Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

module.exports.updateCart = async (req, res) => {
  try {
    const { productId } = req.params;
    const { quantity } = req.body;

    if (!quantity || quantity < 1) {
      return res.status(400).json({
        success: false,
        message: "Quantity must be at least 1",
      });
    }

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    if (quantity > product.stock) {
      return res.status(400).json({
        success: false,
        message: "Not enough stock available",
      });
    }

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const cartItem = user.cart.find(
      (item) => item.product.toString() === productId,
    );

    if (!cartItem) {
      return res.status(404).json({
        success: false,
        message: "Product not found in the cart",
      });
    }
    cartItem.quantity = quantity;

    await user.save();
    await user.populate("cart.product");

    return res.status(200).json({
      success: true,
      message: "Cart quantity updated successfully",
      cart: user.cart,
    });
  } catch (err) {
    console.log("Update Cart Error:", err);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

module.exports.removeFromCart = async (req, res) => {
  try {
    const { productId } = req.params;

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const itemExists = user.cart.some(
      (item) => item.product.toString() === productId,
    );

    if (!itemExists) {
      return res.status(404).json({
        success: false,
        message: "Product not found in the cart",
      });
    }

    user.cart = user.cart.filter(
      (item) => item.product.toString() !== productId,
    );

    await user.save();
    await user.populate("cart.product");

    return res.status(200).json({
      success: true,
      message: "Product removed from cart successfully",
      cart: user.cart,
    });
  } catch (err) {
    console.log("Remove From Cart Error:", err);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
