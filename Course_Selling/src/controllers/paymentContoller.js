import { processPayment } from "../services/paymentService";

export const handlePayment = async(req,res)=>{
    const {courseId,amount,paymentMethod}=req.body;

    const userId=req.user.id; // extracted from jwt middleware

    try{
        const payment = await processPayment(userId,courseId,amount,paymentMethod);
        res.status(201).json({payment});
    }catch(error){
        res.status(400).json({error:error.message});
    }
};