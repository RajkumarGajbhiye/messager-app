const Chat = require("../models/chatModel.js");
const Message = require("../models/messageModel.js");
const User = require("../models/userModel.js");
const ApplicationError = require( "../utils/ApplicationError.js");
const catchErrorAsync = require("../utils/catchErrorAsync.js");

//create new message
const sendMessage =catchErrorAsync(async (req, res, next) => {
    const { content, chatId } = req.body;

    if (!content || !chatId) {
      console.log("Invalid data passed into request");
      return res.sendStatus(400);
    }
  
    var newMessage = {
      sender: req.user._id,
      content: content,
      chat: chatId,
    };
  
    try {
      let message = await Message.create(newMessage);
  
      message = await message.populate("sender", "name pic");
      message = await message.populate("chat");
      message = await User.populate(message, {
        path: "chat.users",
        select: "name pic email",
      });
  
      await Chat.findByIdAndUpdate(req.body.chatId, { latestMessage: message });
  
      res.json(message);
    } catch (error) {
      res.status(400).json({
        status:error.message
      });
      return next(new ApplicationError(error.message))
    }
})

//Get all Messages:

const allMessage=catchErrorAsync(async(req,res,next)=>{
    try {
        const messages = await Message.find({ chat: req.params.chatId })
          .populate("sender", "name pic email")
          .populate("chat");
        res.json(messages);
      } catch (error) {
        res.status(400).json({
            status:error.message
        });
        return next(new ApplicationError (error.message));
      } 
})

module.exports= {sendMessage,allMessage}