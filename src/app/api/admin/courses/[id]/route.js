import connectDB from "@/lib/db";
import Course from "@/models/Course";
import mongoose from "mongoose";
// import fs from "fs";
// import path from "path";

export async function GET(req, { params }) {
  const { id } = params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return Response.json(
      { message: "Invalid course ID" },
      { status: 400 }
    );
  }

  await connectDB();

  const course = await Course.findById(id).lean();
  if (!course) {
    return Response.json(
      { message: "Course not found" },
      { status: 404 }
    );
  }

  return Response.json({ course });
}

export async function PUT(req, { params }) {
  const { id } = await params;
  const body = await req.json();

  await connectDB();

  const updated = await Course.findByIdAndUpdate(id, body, {
    new: true,
    runValidators: true,
  });

  return Response.json({ course: updated });
}

export async function DELETE(req, { params }) {
  try {
    console.log("DELETE called"); // 🔹 log when request arrives
    console.log("Params received:", params); // 🔹 log the params

    const { id } = await params;
    if (!id) {
      console.log("No ID in params!"); // 🔹 log missing id
      return new Response(
        JSON.stringify({ error: "No course ID provided" }),
        { status: 400 }
      );
    }

    await connectDB();
    console.log("Connected to DB"); // 🔹 check DB connection

    const course = await Course.findById(id);
    if (!course) {
      console.log("Course not found for ID:", id); // 🔹 log not found
      return new Response(
        JSON.stringify({ error: "Course not found" }),
        { status: 404 }
      );
    }

    console.log("Course found:", course.title);

    await Course.findByIdAndDelete(id);
    console.log("Course deleted:", course._id);

    return new Response(JSON.stringify({ message: "Course deleted" }), {
      status: 200,
    });
  } catch (err) {
    console.error("Delete error:", err);
    return new Response(JSON.stringify({ error: "Delete failed" }), {
      status: 500,
    });
  }
}
