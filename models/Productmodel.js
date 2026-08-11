const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
    },

    price: { 
      type: Number,
      required: true,
      min: 0,
    },
    // actual selling price after discount on the product
    discountedPrice: {
      type: Number,
      default: 0,
      min: 0,
      validate: {
        validator: function (value) {
          return value < this.price;
        },
        message: "Discount price must be less than the original price",
      },
    },

    Category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    SubCategory: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SubCategory",
    },

    isFeatured: {
      type: Boolean,
      default: false,
    },
    images: [
      {
        type: String,
      },
    ],

    stock: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
    },

    sizes: [
      {
        type: String,
      },
    ],

    colors: [
      {
        type: String,
      },
    ],
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Product", ProductSchema);
