const jwt = require("jsonwebtoken");
const usermodel = require("../models/usermodel");

module.exports = async function (req, res, next) {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Please login first",
      });
    }

    let decoded = jwt.verify(token, process.env.JWT_KEY);
    let user = await usermodel.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({
      success: false,
      message: "Invalid or Expired token",
    });
  }
};
