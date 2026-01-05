import connectDB from "../lib/db";
import Course from "../models/Course";
import HomeClient from "./HomeClient";

function convertCourseToPlain(course) {
  return {
    ...course,
    _id: course._id.toString(),
    curriculum: (course.curriculum || []).map(module => ({
      ...module,
      _id: module._id ? module._id.toString() : undefined,
      sessions: (module.sessions || []).map(session => ({
        ...session,
        _id: session._id ? session._id.toString() : undefined,
      })),
    })),
  };
}

export default async function Home() {
  await connectDB();
  const courses = await Course.find({}).lean();
  const coursesPlain=courses.map(convertCourseToPlain);
  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold mb-2">Courses</h1>
      <p className="mb-6">Total courses: {courses.length}</p>

      <HomeClient courses={coursesPlain} />
    </main>
  );
}
