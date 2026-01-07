import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export function middleware(req) {
  // fallback to header if req.cookies.get() fails
  const token =
    req.cookies.get("token")?.value ||
    req.headers.get("cookie")?.split("token=")?.[1]?.split(";")[0];

  if (!token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  try {
    jwt.verify(token, process.env.JWT_SECRET);
    return NextResponse.next();
  } catch {
    const res = NextResponse.redirect(new URL("/login", req.url));
    res.cookies.delete("token");
    return res;
  }
}


export const config = {
  matcher: ["/dashboard/:path*"], // ✅ ONLY pages
};
