import connectDB from "@/lib/db";
import Course from "@/models/Course";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";
import { z } from "zod";
import { validate, validationError } from "@/lib/validators/validate";
// import { NEXT_BODY_SUFFIX } from "next/dist/lib/constants";

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

export async function GET(req, { params }) {
  try {
    verifyTokenFromCookie(req);

    const { id } = params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ message: "Invalid course ID" }, { status: 400 });
    }

    await connectDB();

    const course = await Course.findById(id).lean();
    if (!course) {
      return NextResponse.json({ message: "Course not found" }, { status: 404 });
    }

    return NextResponse.json({ course });
  } catch (err) {
    return NextResponse.json({ message: err.message }, { status: 401 });
  }
}

export async function PUT(req, { params }) {
  try {
    verifyTokenFromCookie(req);

    const { id } = await params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ message: "Invalid course ID" }, { status: 400 });
    }

    const body = await req.json();
    console.log("Incoming payload:", JSON.stringify(body, null, 2));
    // if( body_.id) delete body._id;
    const parsed = validate(CourseSchema, body);

    if (!parsed.success) {
      console.log("VALIDATION ERRORS:", parsed.errors);
      return validationError(parsed.errors);
    }
    await connectDB();
    const { _id, ...updateData } = parsed.data;
    const updated = await Course.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });
    if (!updated) {
      return NextResponse.json({ message: "Course not found" }, { status: 404 });
    }
    return NextResponse.json({ course: updated });
  } catch (err) {
    console.error("PUT ERROR:", err);
    return NextResponse.json({ message: err.message || "Update failed" }, { status: 401 });
  }
}

export async function DELETE(req, { params }) {
  try {
    verifyTokenFromCookie(req);

    const { id } = await params;

    if (!id) {
      return NextResponse.json({ message: "No course ID provided" }, { status: 400 });
    }

    await connectDB();

    const course = await Course.findById(id);
    if (!course) {
      return NextResponse.json({ message: "Course not found" }, { status: 404 });
    }

    await Course.findByIdAndDelete(id);

    return NextResponse.json({ message: "Course deleted" });
  } catch (err) {
    console.error("DELETE ERROR:", err);
    return NextResponse.json({ message: err.message || "Delete failed" }, { status: 401 });
  }
}
