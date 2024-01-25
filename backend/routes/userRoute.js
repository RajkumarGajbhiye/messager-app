const express = require("express");
const {
  registerUser,
  loginUser,
  allUser,
  protect,
} = require( "../controllers/userController.js");

const router = express.Router();

router.post("/register", registerUser);
router.route("/login").post(loginUser);
router.route("/alluser").get(protect, allUser);
module.exports= router;
