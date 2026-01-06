"use client";

import { useState } from "react";
import CourseCard from "@/components/CourseCard";
import DepartmentFilter from "@/components/DepartmentFilter";

export default function HomeClient({ courses }) {
  const [department, setDepartment] = useState("ALL");

  const departments = [
    ...new Set(courses.map((c) => c.department).filter(Boolean)),
  ];

  const filteredCourses =
    department === "ALL"
      ? courses
      : courses.filter((c) => c.department === department);

  return (
    <>
      <div className="filter-bar">
        <DepartmentFilter
          departments={departments}
          value={department}
          onChange={setDepartment}
        />
      </div>

      <div className="course-grid">
        {filteredCourses.map(course => (
          <CourseCard key={course._id} course={course} />
        ))}
      </div>
    </>

  );
}
