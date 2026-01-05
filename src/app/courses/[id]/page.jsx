import connectDB from "../../../lib/db";
import Course from "../../../models/Course";
import { notFound } from "next/navigation";
import CourseImage from "../components/CourseImage"; // ✅ Client Component imported
import mongoose from "mongoose";

export default async function CoursePage({ params }) {
  const { id } = await params; // unwrap Promise
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return notFound(); // clean 404, no crash
  }
  await connectDB();
  const course = await Course.findById(id).lean();
  if (!course) return notFound();

  return (
    <main style={{ padding: "2rem" }}>
      <h1>{course.title}</h1>
      <CourseImage src={course.thumbnail} alt={course.title} />
      <p>{course.description}</p>
      <p>Department: {course.department}</p>
      <p>Instructors: {course.instructors?.join(", ")}</p>
      <p>Price: ${course.price}</p>

      <h3>Curriculum</h3>
      {course.curriculum?.map((module, mi) => (
        <div key={mi}>
          <strong>{module.title}</strong>
          <ul>
            {module.sessions?.map((session, si) => (
              <li key={si}>
                {session.title} - {session.type} ({session.duration} mins)
              </li>
            ))}
          </ul>
        </div>
      ))}
    </main>
  );
}
