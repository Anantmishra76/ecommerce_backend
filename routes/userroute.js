const express = require("express");
const router = express.Router();
const { registeruser } = require("../controllers/auth-controller");

router.get("/", (req, res) => {
  res.send("This is the user route");
});

router.post("/register", registeruser);



module.exports = router;