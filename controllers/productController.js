const Product = require("../models/Productmodel");


module.exports.createProduct = async (req, res) => {
  try {
    const {
      title,
      description,
      price,
      discountPrice,
      category,
      subcategory,
      isFeatured,
      images,
      stock,
      sizes,
      colors,
    } = req.body;

    if (!title || !description || !price || !category || stock === undefined) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields.",
      });
    }

    const product = await Product.create({
      title,
      description,
      price,
      discountPrice,
      category,
      subcategory,
      isFeatured,
      images,
      stock,
      sizes,
      colors,
    });

    return res.status(201).json({
      success: true,
      message: "Product created successfully.",
      product,
    });
  } catch (error) {
    console.error("Create Product Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};
