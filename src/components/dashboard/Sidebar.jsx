"use client";

const MENU = [
  { key: "overview", label: "Overview" },
  { key: "add-course", label: "Add Course" },
  { key: "edit-course", label: "Edit Course" },
  { key: "admin", label: "Admin & Keys" },
];

export default function Sidebar({ active, onChange }) {
  return (
    <aside className="sidebar">
      <h2 className="sidebar-title">Dashboard</h2>

      <nav className="sidebar-menu">
        {MENU.map(item => (
          <button
            key={item.key}
            className={`sidebar-item ${active === item.key ? "active" : ""}`}
            onClick={() => onChange(item.key)}
          >
            {item.label}
          </button>
        ))}
      </nav>
    </aside>
  );
}
