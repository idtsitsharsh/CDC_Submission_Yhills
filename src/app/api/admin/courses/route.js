import connectDB from "@/lib/db";
import Course from "@/models/Course";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { z } from "zod";
import { validate, validationError } from "@/lib/validators/validate";

const CourseSchema = z.object({
  title: z.string().min(3),
  department: z.string().min(2),

  instructors: z.array(z.string()).optional().default([]),

  thumbnail: z.string().url().optional(),
  description: z.string().optional(),

  language: z.array(z.string()).optional().default([]),

  curriculum: z.array(
    z.object({
      title: z.string(),
      sessions: z.array(
        z.object({
          title: z.string(),
          type: z.enum(["video", "blog"]),
          duration: z.number().min(0),
        })
      ).optional().default([]),
    })
  ).optional().default([]),

  price: z.number().nonnegative().optional(),
});


function verifyTokenFromCookie(req) {
  const token = req.cookies.get("token")?.value;
  if (!token) throw new Error("Unauthorized");
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch {
    throw new Error("Invalid token");
  }
}

export async function GET() {
  await connectDB();
  try {
    const courses = await Course.find({}).lean();
    return Response.json({ courses });
  } catch (err) {
    console.error(err);
    return Response.json(
      { message: "Server error" },
      { status: 500 }
    );
  }
}

export async function POST(req) {
  try {
    verifyTokenFromCookie(req);
    await connectDB();

    const body = await req.json();
    const parsed = validate(CourseSchema, body);

    if (!parsed.success) {
      return validationError(parsed.errors);
    }
    const newCourse = await Course.create(parsed.data);
    return NextResponse.json({ course: newCourse }, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: err.message || "Server error" }, { status: 500 });
  }
}