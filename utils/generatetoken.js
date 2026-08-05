const jwt = require("jsonwebtoken");

const ExpireIN = "1d";

const generateToken = (user) => {
  return jwt.sign({ email: user.email, id: user._id }, process.env.JWT_KEY, {
    expiresIn: ExpireIN,
  });
};
module.exports.generateToken = generateToken;
