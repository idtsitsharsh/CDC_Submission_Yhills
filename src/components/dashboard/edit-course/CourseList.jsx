"use client";

import { useEffect, useState } from "react";

export default function CourseList({ query, onSelect, refreshKey }) {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchCourses = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/courses", {
        credentials: "include",
      });
      const data = await res.json();
      setCourses(data.courses || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, [refreshKey]);

  const filtered = courses.filter(course =>
    course.title.toLowerCase().includes(query.toLowerCase())
  );

  if (loading) return <p>Loading courses...</p>;

  return (
    <div className="course-list">
      {filtered.map(course => (
        <div
          key={course._id}
          className="course-row"
          onClick={() => onSelect(course)}
        >
          <strong>{course.title}</strong>
          <span>₹{course.price}</span>
        </div>
      ))}

      {filtered.length === 0 && (
        <p className="hint">No courses found</p>
      )}
    </div>
  );
}
