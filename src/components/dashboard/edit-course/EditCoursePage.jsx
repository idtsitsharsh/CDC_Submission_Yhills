"use client";

import { useState } from "react";
import CourseSearch from "./CourseSearch";
import CourseList from "./CourseList";
import EditCourseForm from "./EditCourseForm";

export default function EditCoursePage() {
  const [query, setQuery] = useState("");
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const refreshCourses = () => {
    setRefreshKey(prev => prev + 1);
    setSelectedCourse(null);
  };

  return (
    <>
      <h1 className="page-title">Edit Course</h1>

      {!selectedCourse ? (
        <>
          <CourseSearch query={query} setQuery={setQuery} />
          <CourseList
            query={query}
            onSelect={setSelectedCourse}
            refreshKey={refreshKey}
          />
        </>
      ) : (
        <EditCourseForm
          course={selectedCourse}
          onBack={() => setSelectedCourse(null)}
          onSuccess={refreshCourses}
        />
      )}
    </>
  );
}
