import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export function middleware(req) {
  const cookieHeader = req.headers.get("cookie") || "";
  const token = cookieHeader.split("; ").find(c => c.startsWith("token="))?.split("=")[1];

  if (!token) {
    console.log("No token in middleware for path:", req.nextUrl.pathname);
    return NextResponse.next(); // let page load
  }

  try {
    jwt.verify(token, process.env.JWT_SECRET);
    return NextResponse.next();
  } catch {
    console.log("Invalid token in middleware for path:", req.nextUrl.pathname);
    const res = NextResponse.redirect(new URL("/login", req.url));
    res.cookies.delete("token");
    return res;
  }
}



export const config = {
  matcher: ["/dashboard/:path*"],
};
