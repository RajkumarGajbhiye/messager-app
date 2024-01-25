const catchErrorAsync = require("../utils/catchErrorAsync.js");
const ApplicationError = require("../utils/ApplicationError.js");
const User = require("../models/userModel.js");
const {generateToken,authTokenVerification} = require( "../utils/generateToken.js");


//register:
const registerUser = catchErrorAsync(async(req,res,next)=>{
const {name,email,password,pic} = req.body;

if(!name || !email || !password){
    res.status(400).json({
     status:"Please Enter all the fields"   
    });
   return next(new ApplicationError("Please Enter all the fields")) 
}

const userExists = await User.findOne({email});

if(userExists){
res.status(400).json({
 status:"User already exist"
    })
return next(new ApplicationError(" User already exist")) 
}

const user = await User.create({
    name,
    email,
    password,
    pic, 
})

if(user){
    // const { password, ...info } = user._doc;
    res.status(201).json({
        status:"Successful signup!",
        // ...info,
       user
    })
    
}else{
   res.status(400).json({
    status:"Failed to Create the User"
   });
   return next(new ApplicationError("Failed to Create the User"))
}

})

//login

const loginUser = catchErrorAsync(async(req,res,next)=>{
    const {email,password} = req.body;

    if(!email || !password){
        res.status(400).json({
            status:"Please provide email and password" 
         });
        return next(new ApplicationError('Please provide email and password'));
    }

   const user = await User.findOne({email});
   if(user && (await user.matchPassword(password))) {
    const token = generateToken(user._id);
    res.status(201).json({
        status:"Successful login!",
        token 
     })
     
 }else{
    res.status(401).json({
       status:"Incorrect credentials" 
    });
    return next(new ApplicationError("Incorrect credentials"))
 }
})

//get all user:

const allUser = catchErrorAsync(async(req,res,next)=>{
    const keyword = req.query.search
    ? {
        $or: [
          { name: { $regex: req.query.search, $options: "i" } },
         { email: { $regex: req.query.search, $options: "i" } },
        ],
      }
    : {};
 
const users = await User.find(keyword).find({ _id: { $ne: req.user._id } });
  res.send(users);

}) 

//protected route

const protect = catchErrorAsync(async (req,res,next)=>{
let token = ''
 //console.log(req.headers.authorization)
if(req.headers?.authorization?.startsWith('Bearer ')){
token = req.headers.authorization.split(' ')[1]
}
if(!token){
  res.status(401).json({
          status:"Not authorized"
        })
  return next(new ApplicationError('Not authorized',401)) //401 means not authorised
}
const payload = await authTokenVerification(token)

const userInfo = await User.findById(payload.id)

if(!userInfo){
  return next(new ApplicationError('The user does not exist',401))
}
req.user = userInfo
next()
})

module.exports= {registerUser,loginUser,allUser,protect}