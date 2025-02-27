import http from "http";
import dotenv from "dotenv";
import app from "./src/app.js";
import connectDB from "../src/config/db.js";

dotenv.config();

// Connect to database
connectDB();

// create an http server
const server = http.createServer(app);

// start the server
const PORT = process.env.PORT || 5000;
server.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`);
})