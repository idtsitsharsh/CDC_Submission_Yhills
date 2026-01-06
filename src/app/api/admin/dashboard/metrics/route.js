import { NextResponse } from "next/server";

export async function GET() {
  // Random fake data
  const departments = ["CS", "Math", "Physics", "AI", "Design"];

  const coursesPerDepartment = departments.map(dep => ({
    department: dep,
    count: Math.floor(Math.random() * 15) + 3,
  }));

  const courseTypes = [
    { type: "Video", value: Math.floor(Math.random() * 60) + 20 },
    { type: "Blog", value: Math.floor(Math.random() * 40) + 10 },
  ];

  return NextResponse.json({
    coursesPerDepartment,
    courseTypes,
  });
}
