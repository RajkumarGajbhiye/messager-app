const express= require( "express");
const {
  protect,
} = require("../controllers/userController.js");
const { sendMessage,allMessage } = require( "../controllers/messageController.js");

const router = express.Router();


router.route("/createNewMessage").post(protect,sendMessage);
router.route("/fatchsingleChat/:chatId").get(protect,allMessage);

module.exports= router;
