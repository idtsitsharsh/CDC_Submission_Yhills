"use client";

import { useEffect, useState } from "react";

export default function AdminKeysPanel({ currentAdmin }) {
    // console.log("AdminKeysPanel currentAdmin:", currentAdmin);
  const [adminKeys, setAdminKeys] = useState([]);
  const [loadingAdmins, setLoadingAdmins] = useState(true);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

    useEffect(() => {
    // console.log("useEffect triggered, currentAdmin =", currentAdmin);
    if (!currentAdmin) return;
    // console.log("Fetching admins now...");
    setLoadingAdmins(true);

    async function fetchAdmins() {
        try {
        const res = await fetch("/api/admin/admins", {
            credentials: "include",
        });

        const data = await res.json();

        const filtered = (data.admins || []).filter(
            (admin) => admin._id !== currentAdmin._id
        );

        setAdminKeys(filtered);
        } catch (err) {
        console.error("Failed to fetch admins:", err);
        setAdminKeys([]);
        } finally {
        setLoadingAdmins(false);
        }
    }

    fetchAdmins();
    }, [currentAdmin]);
  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      setMessage("❌ Passwords do not match.");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const res = await fetch("/api/admin/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage("✅ Password changed successfully!");
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        setMessage(`❌ ${data.message}`);
      }
    } catch {
      setMessage("❌ Server error.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteKey = async (id) => {
    if (!confirm("Delete this admin key?")) return;

    const res = await fetch("/api/admin/admins", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ id }),
    });

    if (res.ok) {
      setAdminKeys((prev) => prev.filter((a) => a._id !== id));
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
      {/* ===== Change Password ===== */}
      <div style={panelStyle}>
        <h3>Change Admin Password</h3>

        <input
          type="password"
          placeholder="Current Password"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          style={inputStyle}
        />
        <input
          type="password"
          placeholder="New Password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          style={inputStyle}
        />
        <input
          type="password"
          placeholder="Confirm New Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          style={inputStyle}
        />

        <button onClick={handleChangePassword} disabled={loading} style={buttonStyle}>
          {loading ? "Saving..." : "Change Password"}
        </button>

        {message && (
          <p style={{ marginTop: "0.5rem", color: message.includes("❌") ? "red" : "green" }}>
            {message}
          </p>
        )}
      </div>

      {/* ===== Admin Keys ===== */}
      <div style={panelStyle}>
        <h3>Manage Other Admin Keys</h3>

            {!currentAdmin || loadingAdmins ? (
            <p>Loading admins...</p>
            ) : adminKeys.length === 0 ? (
            <p>No other admin keys found.</p>
            ) : (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid #e5e7eb" }}>
                <th style={thStyle}>Admin Email</th>
                <th style={thStyle}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {adminKeys.map((admin) => (
                <tr key={admin._id}>
                  <td style={tdStyle}>{admin.email}</td>
                  <td style={tdStyle}>
                    <button style={actionBtnStyle} onClick={() => handleDeleteKey(admin._id)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

const panelStyle = {
  padding: "1.5rem",
  border: "1px solid #e5e7eb",
  borderRadius: "10px",
  background: "white",
};

const inputStyle = {
  width: "100%",
  marginBottom: "1rem",
  padding: "0.6rem",
  borderRadius: "6px",
  border: "1px solid #ccc",
};

const buttonStyle = {
  padding: "0.6rem",
  borderRadius: "6px",
  border: "none",
  backgroundColor: "#2563eb",
  color: "#fff",
  cursor: "pointer",
};

const thStyle = { textAlign: "left", padding: "0.5rem" };
const tdStyle = { padding: "0.5rem" };
const actionBtnStyle = {
  padding: "0.3rem 0.6rem",
  borderRadius: "6px",
  border: "1px solid #ccc",
  background: "white",
  cursor: "pointer",
};
