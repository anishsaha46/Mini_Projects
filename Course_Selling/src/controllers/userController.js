import User from "../models/User.js";

export const getUserProfile = async(req,res)=>{
    try{
        const user =await User.findById(req.user.id).select("-password");
        if(!user){
            return res.status(404).json({message:"User not found"});
        }
        res.status(200).json({user});
    }catch(error){
        res.status(500).json({error:error.message});
    }
}

export const updateUserProfile = async(req,res)=>{
    try{
        const user =await User.findById(req.user.id);
        if(!user){
            return res.status(404).json({message:"User not found"});
        }
        // update user profile
        user.name = req.body.name || user.name;
        user.email = req.body.email || user.email;

        if(req.body.password){
            user.password = req.body.password;
        }

        const updatedUser = await user.save();
        res.status(200).json({user:updatedUser});
    }catch(error){
        res.status(500).json({error:error.message});
    }
};

export const getAllUsers = async(req,res)=>{
    try{
        if(req.user.role !== "Admin"){
            return res.status(403).json({message:"Unauthorized"});
        }
        const users = await User.find().select("-password");
        res.status(200).json({users});
    }catch(error){
        res.status(500).json({error:error.message});
    }
}