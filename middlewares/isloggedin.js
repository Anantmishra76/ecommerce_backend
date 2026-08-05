// const jwt = require("jsonwebtoken");
// const usermodel = require("../model/usermodel");

// module.exports = async function (req, res, next) {
//   try {
//     const token = req.cookies.token;
//     if (!token) {
//       return res.status(401).json({
//         success: false,
//         message: "Plss login first",
//       });
//     }

//     let decoded = jwt.verify(req.cookies.token, process.env.JWT_KEY);
//     let user = await usermodel
//       .findOne({ email: decoded.email })
//       .select("-password");

//     if (!user) {
//       return res.status(404).json({
//         success: false,
//         message: " USer not found",
//       });
//     }
//     req.user = user;
//     next();
//   } catch (err) {
//     return res.status(401).json({
//       success: false,
//       message: "Invalid or Expired token",
//     });
//   }
// };
