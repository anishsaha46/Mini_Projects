import { createCourse,getCourses,getCourseById,updateCourse } from "../services/courseService";

export const createNewCourse = async(req,res)=>{
    const {title,description,price,categories}=req.body;
    const instrutorId = req.user.id;

    try{
        const course= await createCourse(title,description,price,instrutorId,categories);
        res.status(201).json({course});
    }catch(error){
        res.status(400).json({error:error.message});
    }
};

export const getAllCourses = async(req,res)=>{
    try{
        const courses =await getCourses();
        res.status(200).json({courses});
    } catch(error){
        res.status(500).json({error:error.message});
    }
}

export const getSingleCouse = async(req,res)=>{
    try{
        const course =await getCourseById(req.params.id);
        if(!course){
            return res.status(404).json({message:"Course not found"});
        }
        res.status(200).json({course});
    }catch(error){
        res.status(500).json({error:error.message});
    }
}

export const updateCouseDetails = async(req,res)=>{
    try{
        const course = await updateCourse(req.params.id,req.body);
        res.status(200).json({course});
    }catch(error){
        res.status(500).json({error:error.message});
    }
}