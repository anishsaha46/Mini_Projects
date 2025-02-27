// Responsibilities:

// Signup (POST /api/auth/signup)
// Login (POST /api/auth/login)

import {signup,login } from '../services/authService.js';

export const signupUser = async(req,res) =>{
    const {name,email,password}=req.body;
    try{
        const user = await signup(name,email,password);
        res.status(201).json({user});
    }catch(error){
        console.log(400).json({message:error.message});
    }
}

export const loginUser = async(req,res)=>{
    const {email,password}=req.body
    try{
        const user = await login(email,password);
    }catch(error){
        console.log(400).json({message:error.message});
    }
}