require("dotenv").config();
const express = require("express");
const cookieParser = require("cookie-parser");
const connectDB = require("./config/mongoose-connection");
const app = express();
const PORT = 3000;

const authRouter = require("./routes/authRoutes");
const userRouter = require("./routes/userRoutes");
const adminRouter = require("./routes/adminRoutes");

app.use(express.json());
app.use(cookieParser());

// model
const User = require("./models/usermodel");
const Product = require("./models/Productmodel");
const Category = require("./models/categoryModel");
const SubCategory = require("./models/SubcategoryModel");

connectDB();

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/admin", adminRouter);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
