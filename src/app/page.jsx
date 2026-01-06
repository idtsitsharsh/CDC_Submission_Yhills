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
    <main className="container">
      <h1 className="page-title">Courses</h1>
      <p className="page-subtitle">Total courses: {courses.length}</p>
      {console.log("Hey Logs are working!!")}
      <HomeClient courses={coursesPlain} />
    </main>
  );
}
