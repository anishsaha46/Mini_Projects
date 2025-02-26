import { timeStamp } from "console";
import mongoose from "mongoose";

const userSchema= new mongoose.Schemma({
    name:{type:"string",required:"true"},
    email:{type:"string",required:"true",unique:"true"},
    password:{type:"string",required:"true"},
    role:{type:"string",enum:["user","admin"],default:"student"},
    enrolledCouses:[{type:mongoose.Schema.Types.ObjectId,ref:"Course"}],
    createdCourses:[{type:mongoose.Schema.Types.ObjectId,ref:"Course"}],
},{timeStamps:true})

export default mongoose.model("User",userSchema);