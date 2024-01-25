const Chat = require("../models/chatModel.js");
const User = require("../models/userModel.js");
const ApplicationError = require("../utils/ApplicationError.js");
const catchErrorAsync = require("../utils/catchErrorAsync.js");

//access chat
const accessChat = catchErrorAsync(async (req, res, next) => {
  const { userId } = req.body;
  if (!userId) {
    console.log("UserId params not sent with request");
    return res.sendStatus(400);
  }

 let isChat = await Chat.find({
    isGroupChat: false,
    $and: [
      { users: { $elemMatch: { $eq: req.user._id } } },
      { users: { $elemMatch: { $eq: userId } } },
    ],
  })
    .populate("users", "-password")
    .populate("latestMessage");

  isChat = await User.populate(isChat, {
    path: "latestMessage.sender",
    select: "name pic email",
  });
  if (isChat.length > 0) {
    res.send(isChat[0]);
  } else {
    var chatData = {
      chatName: "sender",
      isGroupChat: false,
      users: [req.user._id, userId],
    };
    try {
      const createdChat = await Chat.create(chatData);
      const FullChat = await Chat.findOne({ _id: createdChat._id }).populate(
        "users",
        "-password"
      );
      res.status(200).send(FullChat);
    } catch (error) {
      res.status(400).json({
        error: error.message,
      });
      return next(new ApplicationError(error.message));
    }
  }
});

//fetch all chats for a user

const fetchChats = catchErrorAsync(async(req,res,next)=>{
    try{
        Chat.find({users:{$elemMatch:{$eq:req.user._id}}})
     .populate("users","-password") 
     .populate("groupAdmin","-password")
     .populate("latestMessage","-password")
.sort({updatedAt:-1})
.then(async (results)=>{
   results = await User.populate(results,{
    path:"latestMessage.sender",
    select:"name pic email",
   });
   res.status(200).send(results)
})
    }catch(err){
res.status(400).json({
   error:err.message
})
return next(new ApplicationError(err.message))
    }
})

//Create New Group Chat

const createGroupChat = catchErrorAsync(async(req,res,next)=>{
if(!req.body.users || !req.body.name){
    res.status(400).send({
        message:"Please Fill all the fields"
    })
}
var users = JSON.parse(req.body.users);

if(users.length< 2){
    return res.status(400).send("More than 2 users are required to form a group chat")
}

users.push(req.users);

try{
const groupChat = await Chat.create({
    chatName:req.body.name,
    users:users,
    isGroupChat:true,
    groupAdmin:req.users,
});

const fullGroupChat = await Chat.findOne({_id:groupChat._id})
.populate("users","-password")
.populate("groupAdmin","-password")
res.status(200).json(fullGroupChat);
}catch(err){
res.status(400).json({
    err:err.message
})
return next(new ApplicationError(err.message))
}
})

//Rename Group

const renameGroup = catchErrorAsync(async(req,res,next)=>{
const {chatId,chatName} = req.body;
const updatedChat = await Chat.findByIdAndUpdate(
    chatId,
    {
      chatName
    },
    {
        new:true,
    }
).populate("users","-password")
.populate("groupAdmin","-password");

if(!updatedChat){
    res.status(404).json({
        status:"Chat not found"
    })
    return next(new ApplicationError("Chat not found"))
}else{
    res.json(updatedChat)
}
})

//add to group
const addToGroup = catchErrorAsync(async(req,res,next)=>{
const {chatId,userId} = req.body;
const added = await Chat.findByIdAndUpdate(chatId,{$push:{users:userId}},{new:true})
.populate("users","-password")
.populate("groupAdmin","-password");

if(!added){
  res.status(404).json({
    status:"Chat not found"
  })
  return next(new ApplicationError("Chat not found"))
}else{
  res.json(added)
}
})

//remove from group

const removeFromGroup = catchErrorAsync(async(req,res,next)=>{
  const {chatId,userId} = req.body;
const remove = await Chat.findByIdAndUpdate(chatId,{$pull:{users:userId}},{new:true})
.populate("users","-password")
.populate("groupAdmin","-password");

if(!remove){
  res.status(404).json({
    status:"Chat not found"
  })
  return next(new ApplicationError("Chat not found"))
}else{
  res.json(remove)
}
})

module.exports = { accessChat,fetchChats,createGroupChat,renameGroup,addToGroup,removeFromGroup};
