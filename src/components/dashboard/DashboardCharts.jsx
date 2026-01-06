"use client";

import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const COLORS = ["#6366f1", "#22c55e"];

export default function DashboardCharts() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch("/api/admin/dashboard/metrics")
      .then(res => res.json())
      .then(setData)
      .catch(console.error);
  }, []);

  if (!data) return <p>Loading charts...</p>;

  return (
    <>
      <h1 className="page-title">Sales Metrics</h1>

      <div className="charts-grid">
        {/* Bar Chart */}
        <div className="chart-card">
          <h3>Courses per Department</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data.coursesPerDepartment}>
              <XAxis dataKey="department" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Pie Chart */}
        <div className="chart-card">
          <h3>Course Type Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={data.courseTypes}
                dataKey="value"
                nameKey="type"
                outerRadius={100}
                label
              >
                {data.courseTypes.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </>
  );
}
