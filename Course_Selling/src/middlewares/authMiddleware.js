import jwt from "jsonwebtoken";
import { User } from "../models/userModel";
import dotenv from "dotenv";

dotenv.config();
export const protect = async(req,res,next)=>{
    let token= req.headers.authorization;
    if(token && token.startWith("bearer")){
        try{
            token = token.split(" ")[1];
            const decoded = jwt.verify(token,process.env.JWT_SECRET);
            req.user = await User.findById(decoded.id);
            next();
        }catch(error){
            res.status(401).json({error: "Invalid token"});
        }
    }else{
        res.status(401).json({error: "No token, authorization denied"});
    }
};

export const adminOnly = async(req, res, next)=>{
    if(req.user && req.user.role === "admin"){
        next();
    } else{
        res.status(403).json({error: "Not authorized as"});
    }
}