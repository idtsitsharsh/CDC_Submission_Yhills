"use client";

import { useState,useEffect } from "react";
import { useRouter } from "next/navigation";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import Sidebar from "@/components/dashboard/Sidebar";
import AddCourseWizard from "@/components/dashboard/add-course/AddCourseWizard";
import EditCoursePage from "@/components/dashboard/edit-course/EditCoursePage";
import AdminKeysPanel from "./components/AdminKeysPanel";
import DashboardCharts from "@/components/dashboard/DashboardCharts";

export default function DashboardPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("overview");
  const [currentAdmin, setCurrentAdmin] = useState(null); 
  useEffect(() => {
    fetch("/api/admin/check")
      .then(res => res.json())
      .then(data => {
        if (!data.success) {
          router.push("/login"); 
        } else {
          setCurrentAdmin(data.admin); 
        }
      })
      .catch(() => router.push("/login")); 
  }, [router]);
  return (
    <DashboardLayout
      sidebar={
        <Sidebar active={activeTab} onChange={setActiveTab} />
      }
    >
      {activeTab === "overview" && <Overview />}
      {activeTab === "add-course" && <AddCourseWizard />}
      {activeTab === "edit-course" && <EditCoursePage />}
      {/* {console.log(currentAdmin)} */}
      {activeTab === "admin" && <AdminKeysPanel currentAdmin={currentAdmin}/>}
    </DashboardLayout>
  );
}

/* ---------- TEMP COMPONENTS ---------- */

function Overview() {
  return (
    <>
      <h1 className="page-title">Overview</h1>

      <div className="stats-grid">
        <StatCard title="Total Revenue" value="$48,920" />
        <StatCard title="Courses Sold" value="1,284" />
        <StatCard title="Active Students" value="3,912" />
      </div>
      <div style={{ marginTop: "2rem" }}>
        <DashboardCharts />
      </div>
    </>
  );
}

function StatCard({ title, value }) {
  return (
    <div className="stat-card">
      <p className="stat-title">{title}</p>
      <h3 className="stat-value">{value}</h3>
    </div>
  );
}

// function Placeholder({ title }) {
//   return (
//     <>
//       <h1 className="page-title">{title}</h1>
//       <p style={{ color: "#6b7280" }}>
//         UI coming in next steps…
//       </p>
//     </>
//   );
// }
