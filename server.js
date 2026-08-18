require("dotenv").config();
const express = require("express");
const cookieParser = require("cookie-parser");
const connectDB = require("./config/mongoose-connection");
const app = express();
const PORT = process.env.PORT || 3000;

const authRouter = require("./routes/authRoutes");
const userRouter = require("./routes/userRoutes");
const adminRouter = require("./routes/adminRoutes");
const productRouter = require("./routes/productRoutes");
const categoryRouter = require("./routes/categoryRoutes");
const subCategoryRouter = require("./routes/subCategoryRoute");
const cartRoutes = require("./routes/cartRoutes");
const WishlistRoute = require("./routes/WishlistRoute");
const orderRoutes = require("./routes/orderRoutes");

app.use(express.json());
app.use(cookieParser());

// for database connection
connectDB();

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/admin", adminRouter);
app.use("/api/v1/categories", categoryRouter);
app.use("/api/v1/subcategories", subCategoryRouter);
app.use("/api/v1/products", productRouter);
app.use("/api/v1/cart", cartRoutes);
app.use("/api/v1/wishlist", WishlistRoute);
app.use("/api/v1/orders", orderRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
