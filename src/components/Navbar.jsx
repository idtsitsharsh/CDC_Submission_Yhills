"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();

  const isLoginPage = pathname === "/login";
  const isDashboard = pathname.startsWith("/dashboard");

  function logout() {
    localStorage.removeItem("adminToken");
    router.push("/");
  }

  return (
    <nav className="navbar">
      <Link href="/" className="logo">YHills</Link>

      <div className="nav-actions">
        {!isLoginPage && !isDashboard && (
          <Link href="/login" className="btn">Login</Link>
        )}

        {isDashboard && (
          <button onClick={logout} className="btn">Logout</button>
        )}
      </div>
    </nav>
  );
}
