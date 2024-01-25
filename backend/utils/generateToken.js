const jwt =require("jsonwebtoken") ;

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

const authTokenVerification = async(token) => {
  return await jwt.verify(token, process.env.JWT_SECRET);
};
module.exports= { generateToken, authTokenVerification };
