const express = require("express");
const router = express.Router();
const { registeruser, loginuser , Logoutuser } = require("../controllers/auth-controller");

router.get("/", (req, res) => {
  res.send("This is the user route");
});

router.post("/register", registeruser);
router.post("/login", loginuser);
router.post("/logout", Logoutuser);

module.exports = router;
