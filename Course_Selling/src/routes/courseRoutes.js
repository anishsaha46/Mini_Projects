import express from "express";
import { createNewCourse, getAllCourses, getSingleCourse, updateCourseDetails } from "../controllers/courseController.js";
import { protect, adminOnly } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/", protect, adminOnly, createNewCourse); // Only admin can create courses
router.get("/", getAllCourses);
router.get("/:id", getSingleCourse);
router.put("/:id", protect, adminOnly, updateCourseDetails); // Only admin can update courses

export default router;
