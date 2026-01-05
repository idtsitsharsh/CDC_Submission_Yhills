"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import CourseCard from "./components/CourseCard";
import EditCourseForm from "./components/EditCourseForm";
import AddCourseForm from "./components/AddCourseForm";
import AdminSection from "./AdminSection";


export default function DashboardPage() {
  const router = useRouter();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingCourse, setEditingCourse] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if(!token){
      router.push("/login");
      return;
    }   
    
    fetch("/api/admin/courses" , {
      headers:{
        Authorization:`Bearer ${token}`,
      }
    })
      .then((res) => res.json())
      .then((data) => {
        setCourses(data.courses);
        setLoading(false);
      })
      .catch(() =>{
        router.push("/login");
      });
  }, [router]);

  function handleDeleted(courseId) {
    setCourses(courses.filter((c) => c._id !== courseId));
  }

  const handleUpdated = (updatedCourse) => {
    setCourses(courses.map(c => c._id === updatedCourse._id ? updatedCourse : c));
  };

  const handleAdded = (newCourse) => {
    setCourses([...courses, newCourse]);
  };

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    router.push("/login");
  };

  return (
    <main style={{ padding: "2rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <h1>Admin Dashboard</h1>
        <button onClick={handleLogout} style={{ height: "40px" }}>
          Logout
        </button>
      </div>
      <section>
        <h2>Add New Course</h2>
        <AddCourseForm onAdded={handleAdded} />
      </section>

      {loading ? (
        <p>Loading courses...</p>
      ) : (
        <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem", marginTop: "2rem" }}>
          {courses.map((course) => (
            <div key={course._id}>
              <CourseCard course={course} onDeleted={handleDeleted}/>
              <button onClick={() => setEditingCourse(course)}>Edit</button>
            </div>
          ))}
        </div>
      )}

      {editingCourse && (
        <EditCourseForm
            course={editingCourse}
            onUpdated={handleUpdated}
            onCancel={() => setEditingCourse(null)}
        />
        )}
      <AdminSection />
    </main>
  );
}
