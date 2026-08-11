const SubCategory = require("../models/SubcategoryModel");
const Category = require("../models/categoryModel");
const isValidObjectId = require("../utils/isValidObjectId");


module.exports.getAllSubcategories = async (req, res) => {
  try {
    const subcategories = await SubCategory.find().populate(
      "category",
      "name description image isActive",
    );
    return res.status(200).json({
      success: true,
      message: "All subcategories fetched successfully",
      subcategories,
    });
  } catch (err) {
    console.log("get all subcategories error: ", err);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

module.exports.getSubcategoryByID = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid subcategory ID",
      });
    }

    const subcategory = await SubCategory.findById(id).populate(
      "category",
      "name description image isActive",
    );
    if (!subcategory) {
      return res.status(404).json({
        success: false,
        message: "Subcategory not found",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Subcategory fetched successfully",
      subcategory,
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
        message: "Subcategory already exists in this category",
      });
    }

    console.log(err);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

module.exports.createSubcategory = async (req, res) => {
  try {
    const { name, category, description, image, isActive } = req.body;

    if (!name || !category) {
      return res.status(400).json({
        success: false,
        message: "Subcategory name and category is required",
      });
    }

    if (!isValidObjectId(category)) {
      return res.status(400).json({
        success: false,
        message: "Invalid category ID",
      });
    }

    const existingCategory = await Category.findById(category);
    if (!existingCategory) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    const existingSubcategory = await SubCategory.findOne({
      name: name.trim(),
      category,
    });
    if (existingSubcategory) {
      return res.status(400).json({
        success: false,
        message: "Subcategory already exists in this category",
      });
    }

    const subcategory = await SubCategory.create({
      name: name.trim(),
      category,
      description,
      image,
      isActive,
    });
    return res.status(201).json({
      success: true,
      message: "Subcategory created successfully",
      subcategory,
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
        message: "Subcategory already exists in this category",
      });
    }

    console.log(err);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

module.exports.updateSubcategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, category, description, image, isActive } = req.body;

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid subcategory ID",
      });
    }

    const subcategory = await SubCategory.findById(id);

    if (!subcategory) {
      return res.status(404).json({
        success: false,
        message: "Subcategory not found",
      });
    }

    if (category !== undefined) {
      if (!isValidObjectId(category)) {
        return res.status(400).json({
          success: false,
          message: "Invalid category ID",
        });
      }

      const existingCategory = await Category.findById(category);
      if (!existingCategory) {
        return res.status(404).json({
          success: false,
          message: "Category not found",
        });
      }
      subcategory.category = category;
    }

    if (name !== undefined && name.trim() !== subcategory.name) {
      const existingSubcategory = await SubCategory.findOne({
        name: name.trim(),
        category: subcategory.category,
        _id: { $ne: id },
      });
      if (existingSubcategory) {
        return res.status(400).json({
          success: false,
          message: "Subcategory already exists in this category",
        });
      }
      subcategory.name = name.trim();
    }

    if (description !== undefined) {
      subcategory.description = description;
    }

    if (image !== undefined) {
      subcategory.image = image;
    }

    if (isActive !== undefined) {
      subcategory.isActive = isActive;
    }

    await subcategory.save();

    return res.status(200).json({
      success: true,
      message: "Subcategory updated successfully",
      subcategory,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

module.exports.deleteSubcategory = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid subcategory ID",
      });
    }

    const subcategory = await SubCategory.findById(id);
    if (!subcategory) {
      return res.status(404).json({
        success: false,
        message: "Subcategory not found",
      });
    }
    await SubCategory.findByIdAndDelete(id);
    return res.status(200).json({
      success: true,
      message: "Subcategory deleted successfully",
    });
  } catch (err) {
    console.log("Delete subcategory error: ", err);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};
