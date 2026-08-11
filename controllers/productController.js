const Product = require("../models/Productmodel");
const Category = require("../models/categoryModel");
const SubCategory = require("../models/SubcategoryModel");
const isValidObjectId = require("../utils/isValidObjectId");

module.exports.getAllProduct = async (req, res) => {
  try {
    const products = await Product.find()
      .populate("Category")
      .populate("SubCategory");

    return res.status(200).json({
      success: true,
      message: "All products Fetched Successfully",
      count: products.length,
      products,
    });
  } catch (error) {
    console.error("Get All Products Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch products",
      error: error.message,
    });
  }
};

module.exports.getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid product ID",
      });
    }

    const product = await Product.findById(id)
      .populate("Category")
      .populate("SubCategory");

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Product fetched Successfully",
      product,
    });
  } catch (err) {
    console.log("Get Product By ID Error:", err);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error ",
      error: err.message,
    });
  }
};

module.exports.createProduct = async (req, res) => {
  try {
    const {
      title,
      description,
      price,
      discountedPrice,
      category,
      subcategory,
      isFeatured,
      images,
      stock,
      sizes,
      colors,
    } = req.body;

    if (
      !title ||
      !description ||
      price === undefined ||
      !category ||
      stock === undefined
    ) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields.",
      });
    }

    if (!isValidObjectId(category)) {
      return res.status(400).json({
        success: false,
        message: "Invalid category ID",
      });
    }

    const categoryExists = await Category.findById(category);
    if (!categoryExists) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    if (subcategory) {
      if (!isValidObjectId(subcategory)) {
        return res.status(400).json({
          success: false,
          message: "Invalid subcategory ID",
        });
      }

      const subcategoryExists = await SubCategory.findById(subcategory);
      if (!subcategoryExists) {
        return res.status(404).json({
          success: false,
          message: "Subcategory not found",
        });
      }
    }

    // Write into the schema's actual field names (Category / SubCategory)
    // so this matches .populate("Category") / .populate("SubCategory")
    // used above and in updateProduct below.
    const product = await Product.create({
      title,
      description,
      price,
      discountedPrice,
      Category: category,
      SubCategory: subcategory,
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
    if (error.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }

    console.error("Create Product Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

module.exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      title,
      description,
      price,
      discountedPrice,
      category,
      subcategory,
      isFeatured,
      images,
      stock,
      sizes,
      colors,
    } = req.body;

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid product ID",
      });
    }

    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    if (category !== undefined) {
      if (!isValidObjectId(category)) {
        return res.status(400).json({
          success: false,
          message: "Invalid category ID",
        });
      }

      const categoryExists = await Category.findById(category);
      if (!categoryExists) {
        return res.status(404).json({
          success: false,
          message: "Category not found",
        });
      }
      product.Category = category;
    }

    if (subcategory !== undefined) {
      if (!isValidObjectId(subcategory)) {
        return res.status(400).json({
          success: false,
          message: "Invalid subcategory ID",
        });
      }

      const subcategoryExists = await SubCategory.findById(subcategory);
      if (!subcategoryExists) {
        return res.status(404).json({
          success: false,
          message: "Subcategory not found",
        });
      }
      product.SubCategory = subcategory;
    }

    if (title !== undefined) product.title = title.trim();
    if (description !== undefined) product.description = description;
    if (price !== undefined) product.price = price;
    if (discountedPrice !== undefined)
      product.discountedPrice = discountedPrice;
    if (isFeatured !== undefined) product.isFeatured = isFeatured;
    if (images !== undefined) product.images = images;
    if (stock !== undefined) product.stock = stock;
    if (sizes !== undefined) product.sizes = sizes;
    if (colors !== undefined) product.colors = colors;

    await product.save();

    return res.status(200).json({
      success: true,
      message: "Product Updated Successfully ",
      product,
    });
  } catch (err) {
    if (err.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message: err.message,
      });
    }

    console.log("Update Product Error:", err);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: err.message,
    });
  }
};

module.exports.deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid product ID",
      });
    }

    const product = await Product.findByIdAndDelete(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (err) {
    console.log("Delete Product Error:", err);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: err.message,
    });
  }
};
