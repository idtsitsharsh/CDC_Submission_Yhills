import { z } from "zod";
import mongoose from "mongoose";

export const ObjectIdSchema = z.string().refine(
  val => mongoose.Types.ObjectId.isValid(val),
  { message: "Invalid ID format" }
);

const SessionSchema = z.object({
  title: z.string().min(1, "Session title required"),
  type: z.string().min(1, "Session type required"),
  duration: z.number().nonnegative("Duration must be ≥ 0"),
});

const ModuleSchema = z.object({
  title: z.string().min(1, "Module title required"),
  sessions: z.array(SessionSchema),
});

export const CreateCourseSchema = z.object({
  title: z.string().min(3, "Course title too short"),
  description: z.string().optional(),
  department: z.string().min(2, "Department required"),
  instructors: z.array(z.string()).min(1, "At least one instructor required"),
  thumbnail: z.string().url().optional(),
  language: z.string().optional(),
  curriculum: z.array(ModuleSchema).optional(),
  price: z.number().nonnegative("Price must be ≥ 0"),
});

export const UpdateCourseSchema = CreateCourseSchema.partial();
