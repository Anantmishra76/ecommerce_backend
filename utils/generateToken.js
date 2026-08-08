const jwt = require("jsonwebtoken");

const ExpireIN = "1d";

const generateToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      email: user.email,
      role: user.role,
    },
    process.env.JWT_SECRET,
    { expiresIn: ExpireIN },
  );
};

module.exports.generateToken = generateToken;
