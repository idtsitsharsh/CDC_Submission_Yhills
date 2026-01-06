import connectDB from "../../../lib/db";
import Course from "../../../models/Course";
import { notFound } from "next/navigation";
import CourseImage from "../components/CourseImage"; 
import mongoose from "mongoose";

export default async function CoursePage({ params }) {
  const { id } = await params;

  if (!mongoose.Types.ObjectId.isValid(id)) return notFound();

  await connectDB();
  const course = await Course.findById(id).lean();
  if (!course) return notFound();

  return (
    <main style={{ padding: "2rem" }}>
      <div className="course-detail">
        <h1 className="course-title">{course.title}</h1>

        <div className="course-meta">
          {course.department} • {course.instructors?.join(", ")}
        </div>

        <CourseImage
          src={course.thumbnail}
          alt={course.title}
          variant="detail"
        />

        <p>{course.description}</p>

        <div className="course-price">
          Price: ${course.price}
        </div>

        <div className="curriculum">
          <h3>Curriculum</h3>

          {course.curriculum?.map((module, mi) => (
            <div className="module" key={mi}>
              <div className="module-title">{module.title}</div>
              <ul>
                {module.sessions?.map((session, si) => (
                  <li className="session" key={si}>
                    {session.title} — {session.type} ({session.duration} mins)
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
