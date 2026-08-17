const User = require("../models/usermodel");
const Product = require("../models/Productmodel");

module.exports.getWishlist = async (req, res) => {};

module.exports.addToWishlist = async (req, res) => {
  try {
    const userId = req.user._id;
    const { productId, UserId } = req.params;
    const product = await Product.findById(productId);
    if (!productId) {
      return res.status(400)({
        success: false,
        message: "Product id not found",
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(400)({
        success: false,
        message: "User not found",
      });
    }
    if (user.wishlist.includes(productId)) {
      return res.status(400).json({
        success: false,
        message: "Product already exists in wishlist",
      });
    }
    user.wishlist.push(productId);

    await user.save();
    return res.status(200).json({
      success: true,
      message: "Product added to wishlist",
      wishlist: user.wishlist,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
      error: error.message,
    });
  }
};

module.exports.removefromWishlist = async (req, res) => {};
