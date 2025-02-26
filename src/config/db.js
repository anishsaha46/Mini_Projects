import monoogse from 'moongoose';
const connectDB = async(req , res) =>{
    try{
        const conn = await monoogse.connect(Process.env.MONGO_URI,{
            newUrlParser:true,
            unifiedTopology:true,
        })
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    }catch(err){
        console.log(`Error: ${err.message}`);
        process.exit(1);
    }
}
export default connectDB;