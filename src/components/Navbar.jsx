"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  const isLoginPage = pathname === "/login";
  // const isDashboard = pathname.startsWith("/dashboard");
  useEffect(() => {
    async function checkAuth() {
      try {
        const res = await fetch("/api/admin/check", {
          method: "GET",
          credentials: "include", 
        });

        setIsLoggedIn(res.ok);
      } catch {
        setIsLoggedIn(false);
      } finally {
        setLoading(false);
      }
    }

    checkAuth();
  }, []);

  async function logout() {
    try {
      const res = await fetch("/api/admin/logout", { method: "POST",
          credentials: "include", });
      if (res.ok) {
        setIsLoggedIn(false);
        router.push("/");
      }
    } catch (err) {
      console.error("Logout failed:", err);
    }
  }

  return (
    <nav className="navbar" style={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "1rem 2rem",
      borderBottom: "1px solid #eee",
      backgroundColor: "#fff"
    }}>
      <Link href="/" className="logo" style={{ fontWeight: "bold", fontSize: "1.5rem" }}>
        YHills
      </Link>

      <div className="nav-actions">
        {!loading && !isLoggedIn && !isLoginPage && (
          <Link href="/login" className="btn" style={{
            padding: "0.5rem 1rem",
            borderRadius: "6px",
            backgroundColor: "#0070f3",
            color: "#fff",
            fontWeight: "bold"
          }}>Login</Link>
        )}

        {!loading && isLoggedIn && (
          <button onClick={logout} className="btn" style={{
            padding: "0.5rem 1rem",
            borderRadius: "6px",
            backgroundColor: "#f00",
            color: "#fff",
            fontWeight: "bold",
            cursor: "pointer"
          }}>
            Logout
          </button>
        )}
      </div>
    </nav>
  );
}
