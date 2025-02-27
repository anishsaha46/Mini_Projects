import Course from "../models/Course.js";

export const createCourse = async (title, description, price, instructorId, categories) => {
  const course = await Course.create({
    title,
    description,
    price,
    instructor: instructorId,
    categories,
  });
  return course;
};

export const getCourses = async () => {
  return await Course.find().populate("instructor", "name email");
};

export const getCourseById = async (courseId) => {
  return await Course.findById(courseId).populate("instructor", "name email");
};

export const updateCourse = async (courseId, updates) => {
  return await Course.findByIdAndUpdate(courseId, updates, { new: true });
};
