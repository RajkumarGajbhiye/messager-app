const express = require( "express")
const {protect} = require( "../controllers/userController.js")
const {accessChat,fetchChats,createGroupChat,renameGroup,addToGroup,removeFromGroup} = require( "../controllers/chatController.js")
const router = express.Router();

router.route("/chat").post(protect,accessChat).get(protect,fetchChats)
router.route("/group").post(protect,createGroupChat)
router.route("/grouprename").patch(protect,renameGroup)
router.route("/groupadd").patch(protect,addToGroup)
router.route("/groupremove").patch(protect,removeFromGroup)
module.exports = router;