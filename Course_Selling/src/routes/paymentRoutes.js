import express from "express";
import { handlePayment } from "../controllers/paymentController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/", protect, handlePayment); // Only authenticated users can make payments

export default router;
