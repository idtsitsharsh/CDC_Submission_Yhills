import connectDB from "@/lib/db";
import Course from "@/models/Course";

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
  await connectDB();

  try {
    const body = await req.json();
    const {
      title,
      department,
      instructors,
      thumbnail,
      description,
      language,
      curriculum,
      price,
    } = body;

    if (!title || !department || !instructors) {
      return Response.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    const newCourse = await Course.create({
      title,
      department,
      instructors,
      thumbnail: thumbnail || "",
      description: description || "",
      language,
      curriculum: curriculum || [],
      price: price || 0,
    });

    return Response.json({ course: newCourse }, { status: 201 });
  } catch (err) {
    console.error(err);
    return Response.json(
      { message: "Server error" },
      { status: 500 }
    );
  }
}
