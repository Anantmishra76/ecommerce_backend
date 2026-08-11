const Category = require("../models/categoryModel");
const isValidObjectId = require("../utils/isValidObjectId");

module.exports.getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    return res.status(200).json({
      message: "All category fetched successfully",
      success: true,
      categories,
    });
  } catch (err) {
    console.log("get all category error: ", err);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error ",
    });
  }
};

module.exports.getCategoryByID = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid category ID",
      });
    }

    const category = await Category.findById(id);
    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Category fetched successfully",
      category,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      message: "INternal Server Error ",
    });
  }
};

module.exports.createCategory = async (req, res) => {
  try {
    const { name, description, image, isActive } = req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Category name is required",
      });
    }

    const existingCategory = await Category.findOne({
      name: name.trim(),
    });

    if (existingCategory) {
      return res.status(400).json({
        success: false,
        message: "Category already exists",
      });
    }

    const category = await Category.create({
      name: name.trim(),
      description,
      image,
      isActive,
    });

    return res.status(201).json({
      success: true,
      message: "Category created successfully",
      category,
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }

    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "Category already exists",
      });
    }

    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

module.exports.updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, image, isActive } = req.body;

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid category ID",
      });
    }

    const category = await Category.findById(id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }
    if (name !== undefined && name.trim() !== category.name) {
      const existingCategory = await Category.findOne({
        name: name.trim(),
        _id: { $ne: id },
      });

      if (existingCategory) {
        return res.status(400).json({
          success: false,
          message: "Category already exists",
        });
      }

      category.name = name.trim();
    }

    if (description !== undefined) {
      category.description = description;
    }

    if (image !== undefined) {
      category.image = image;
    }

    if (isActive !== undefined) {
      category.isActive = isActive;
    }

    await category.save();

    return res.status(200).json({
      success: true,
      message: "Category updated successfully",
      category,
    });
  } catch (err) {
    if (err.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message: err.message,
      });
    }

    if (err.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "Category already exists",
      });
    }

    console.log(err);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};


module.exports.deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid category ID",
      });
    }

    const category = await Category.findById(id);
    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }
    await Category.findByIdAndDelete(id);
    return res.status(200).json({
      message: "Category deleted successfully",
    });
  } catch (error) {
    console.log("Delete Category Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error ",
    });
  }
};
