// src/app/api/admin/check/route.js
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import connectDB from "@/lib/db";
import Admin from "@/models/Admin";

export async function GET(req) {
  try {
    const token = req.cookies.get("token")?.value;
    console.log("Cookie received on check API:", token);

    if (!token) {
      console.log("No token found in request cookies");
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log("JWT decoded successfully:", decoded);
    } catch (err) {
      console.error("JWT verification failed:", err);
      return NextResponse.json(
        { success: false, message: "Invalid token" },
        { status: 401 }
      );
    }

    await connectDB();
    const admin = await Admin.findById(decoded.id).select("_id email");
    console.log("Admin fetched from DB:", admin);

    if (!admin) {
      console.log("Admin not found in DB for decoded token:", decoded.id);
      return NextResponse.json(
        { success: false, message: "Admin not found" },
        { status: 401 }
      );
    }

    return NextResponse.json({ success: true, admin });
  } catch (err) {
    console.error("CHECK API ERROR:", err);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}
