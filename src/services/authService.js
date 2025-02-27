import User from "../models/User.js";
import bcrypt from "bcryptjs";
import generateToken from "../utils/generateToken.js";

export const signup = async(name,email,password)=>{
    const existingUser = await User.findOne({email});
    if(existingUser) return {error: "User already exists"};

    const hashedPassword = await bcrypt.hash(password,10);
    const user = await User.create({name,email,password:hashedPassword});

    return {
        _id: user._id,
        name: user.name,
        email: user.email,
        token: generateToken(user._id)
    };
};

export const login = async(email,password)=>{
    const user = await User.findOne({email});
    if(!user) return {error: "User not found"};

    const isMatch = await bcrypt.compare(password,user.password);
    if(!isMatch) return {error: "Invalid password"};

    return {
        _id: user._id,
        name: user.name,
        email: user.email,
        token: generateToken
    };
};