import jwt from 'jsonwebtoken';
const config = require('../config/config').get(process.env.NODE_ENV)
const {SECRETKEY} = config;


export const verifyToken = async(req, res)=>{
    try{
        const token = req.header("token");
        var jwtSecretKey = SECRETKEY;
        if (!token) return res.status(401).json({ message: "Auth Error" });

    const decoded = jwt.verify(token, jwtSecretKey);
    let userdata = await userModel.findOne({ _id: decoded._id });
    if(token != userdata.token){
      return res.status(401).json({ message: "Token Expired" });
    }
    if (userdata.status == 2 || userdata.status == 0) {
      return res.status(401).json({ message: "Auth Error" });
    }
    req.user = decoded;

    next();

    }catch(err){
        if (err.name === "TokenExpiredError") {
            return res.status(401).json({ message: "Token Expired" });
          }
          return res.status(500).send({ message: "Invalid Token" });
        }

    }
