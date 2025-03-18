import mongoose,{model,Schema} from 'mongoose';
mongoose.connect('mongodb://localhost:27017/second_brain');

const UserSchemma=new Schema({
    username:{type:String,required:true,unique:true},
    password:{type:String,required:true},
})

const ContentSchema = new Schema({
    title:String,
    link:String,
    tags:[{type:mongoose.Types.ObjectId,ref:"Tag"}],
    type:String,
    userId:{type:mongoose.Types.ObjectId,ref:'User',required:true},
})

const LinkSchema=new Schema({
    hash:String,
    userId:{type:mongoose.Types.ObjectId,ref:'User',required:true,unique:true},
})

export const UserModel=model("User",UserSchemma);
export const ContentModel=model("Content",ContentSchema);
export const LinkModel=model("Link",LinkSchema);