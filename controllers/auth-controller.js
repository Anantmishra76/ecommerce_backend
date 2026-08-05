const User = require("../models/usermodel");
const bcrypt = require("bcryptjs");
const { generateToken } = require("../utils/generateToken");

module.exports.registeruser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists",
      });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    const token = generateToken(newUser);

    return res.status(201).json({
      message: "User registered successfully",
      token,
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
      },
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

module.exports.loginuser = async (req, res) => {
  let { email, password } = req.body;
  let user = await User.findOne({ email: email });
  if (!user) return res.send("User not found");
  bcrypt.compare(password, user.password, (err, result) => {
    if (result) {
      const token = generateToken(user);
      res.cookie("token", token);
      res.send("logged in successfully");
    } else {
      return res.send("Invalid credentials");
    }
  });
};

module.exports.Logoutuser = (req, res) => {
  res.clearCookie("token");
  res.status(200).json({
    success: true,
    message: "Logged out successfully",
  });
};
