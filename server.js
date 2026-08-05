const express = require("express");
const connectDB = require("./config/mongoose-connection");
const app = express();
const PORT = 3000;

const usersRouter = require("./routes/userroute");

app.use(express.json());

// model
const User = require("./models/usermodel");
const Product = require("./models/Productmodel");
const Category = require("./models/categoryModel");
const SubCategory = require("./models/SubcategoryModel");

connectDB();
require("dotenv").config();

app.get("/", (req, res) => {
  res.send("Hello World");
});
app.use("/api/users", usersRouter);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
