import mongoose from "mongoose";

const SessionSchema = new mongoose.Schema({
  title: { type: String, required: true },
  type: { type: String, enum: ["video", "blog"], required: true },
  duration: { type: Number, required: true },
});

const ModuleSchema = new mongoose.Schema({
  title: { type: String, required: true },
  sessions: [SessionSchema],
});

const CourseSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    department: { type: String, required: true },

    description: { type: String },             
    language: [{ type: String }],               

    instructors: [{ type: String }],

    thumbnail: {
      type: String,
      default: "",                               
    },

    curriculum: [ModuleSchema],
    price: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.models.Course ||
  mongoose.model("Course", CourseSchema);
