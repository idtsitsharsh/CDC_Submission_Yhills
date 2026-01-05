"use client";

import { useEffect, useState } from "react";

export default function AdminSection() {
  const [admins, setAdmins] = useState([]);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // ✅ Lazy initialization (runs only on client)
  const [token] = useState(() => {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("token");
  });

  const [loading, setLoading] = useState(true);

  // ✅ Effect is now ONLY for side-effects (fetching)
  useEffect(() => {
    if (!token) {
    //   setLoading(false);
      return;
    }

    fetch("/api/admin/admins", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(res => res.json())
      .then(data => {
        setAdmins(data.admins || []);
      })
      .catch(() => {
        setAdmins([]);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [token]);

  async function addAdmin(e) {
    e.preventDefault();
    if (!token) return;

    const res = await fetch("/api/admin/admins", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (res.ok) {
      setAdmins(prev => [...prev, data.admin]);
      setEmail("");
      setPassword("");
    } else {
      alert(data.message);
    }
  }

  async function deleteAdmin(id) {
    if (!token) return;

    const res = await fetch("/api/admin/admins", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ id }),
    });

    const data = await res.json();

    if (res.ok) {
      setAdmins(prev => prev.filter(a => a._id !== id));
    } else {
      alert(data.message);
    }
  }

  if (loading) {
    return <p>Loading admins...</p>;
  }

  return (
    <section>
      <h2>Admins</h2>

      <form onSubmit={addAdmin}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />
        <button type="submit">Add Admin</button>
      </form>

      <ul>
        {admins.map(admin => (
          <li key={admin._id}>
            {admin.email}
            <button onClick={() => deleteAdmin(admin._id)}>
              Delete
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
