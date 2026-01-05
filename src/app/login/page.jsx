"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (data.success) {
      localStorage.setItem("adminToken", data.token);
      localStorage.setItem("adminEmail", data.email);
      router.push("/dashboard");
    } else {
      setError(data.message);
    }
  };

  return (
    <main style={{
      minHeight: "80vh",
      display: "flex",
      justifyContent: "center",
      alignItems: "center"
    }}>
      <form
        onSubmit={handleSubmit}
        style={{
          width: "320px",
          padding: "2rem",
          border: "1px solid #ddd",
          borderRadius: "8px"
        }}
      >
        <h2 style={{ marginBottom: "1rem" }}>Admin Login</h2>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{ width: "100%", marginBottom: "1rem", padding: "0.6rem" }}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={{ width: "100%", marginBottom: "1rem", padding: "0.6rem" }}
        />

        <button style={{ width: "100%", padding: "0.6rem" }}>
          Login
        </button>

        {error && <p style={{ color: "red", marginTop: "1rem" }}>{error}</p>}
      </form>
    </main>
  );
}
