import express from "express";
import { signupUser, loginUser } from "../controllers/authController.js";

const router = express.Router();

// User Signup
router.post("/signup", signupUser);

// User Login
router.post("/login", loginUser);

export default router;
