import mongoose from "mongoose";

const courseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  price: { type: Number, required: true },
  instructor: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  studentsEnrolled: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  categories: [{ type: String }],
  content: [
    {
      title: { type: String, required: true },
      videoUrl: { type: String },
      duration: { type: Number } // In minutes
    }
  ]
}, { timestamps: true });

export default mongoose.model("Course", courseSchema);
