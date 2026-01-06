"use client";

export default function DashboardLayout({ sidebar, children }) {
  return (
    <div className="dashboard-layout">
      {sidebar}
      <main className="dashboard-content">
        {children}
      </main>
    </div>
  );
}
