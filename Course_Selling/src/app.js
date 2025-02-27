import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import compression from "compression";

dotenv.config();

// Create express app
const app = express();

// Apply middleware
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cors({origin: process.env.CLIENT_URL, credentials: true}));
app.use(cookieParser());
app.use(helmet());
app.use(compression());
app.use(morgan(dev));

// Routes
app.use("/api/auth",authRoutes);
app.use("/api/courses",courseRoutes);

// Default routes
app.get("/",(req,res)=>{
    res.send("Welcome to Selling PlatForm API is running")
});

// Error handling middleware
app.use((err,req,res,next)=>{
    console.log(`Error: ${err.message}`);
    res.status(500).json({message: err.message});
})

export default app;