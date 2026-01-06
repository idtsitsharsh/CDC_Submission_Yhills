import connectDB from "@/lib/db";
import Admin from "@/models/Admin";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

function verifyTokenFromCookie(req) {
  const token = req.cookies.get("token")?.value;

  if (!token) throw new Error("Unauthorized");

  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch {
    throw new Error("Invalid token");
  }
}

export async function GET(req) {
  try {
    const tokenPayload = verifyTokenFromCookie(req);
    await connectDB();
    // console.log("Token ADMIN: ", decoded);
    const admins = await Admin.find().select("-password").lean();
    // console.log("All Admins: ",allAdmins.map(a => a.email));

    return NextResponse.json({
      success: true,
      admins,
      currentAdminId: tokenPayload.id,
    });
  } catch (err) {
    return NextResponse.json({ success: false, message: err.message }, { status: 401 });
  }
}

export async function PATCH(req) {
  try {
    const tokenPayload = verifyTokenFromCookie(req);
    const currentAdminId = tokenPayload.id;

    await connectDB();

    const { oldPassword, newPassword } = await req.json();

    if (!oldPassword || !newPassword) {
      return NextResponse.json({ success: false, message: "Missing fields" }, { status: 400 });
    }

    const admin = await Admin.findById(currentAdminId);
    if (!admin) return NextResponse.json({ success: false, message: "Admin not found" }, { status: 404 });

    const isMatch = await bcrypt.compare(oldPassword, admin.password);
    if (!isMatch) return NextResponse.json({ success: false, message: "Old password incorrect" }, { status: 401 });

    admin.password = await bcrypt.hash(newPassword, 10);
    await admin.save();

    return NextResponse.json({ success: true, message: "Password updated" });
  } catch (err) {
    return NextResponse.json({ success: false, message: err.message }, { status: 401 });
  }
}

export async function DELETE(req) {
  try {
    const { id: currentAdminId } = verifyTokenFromCookie(req);
    await connectDB();

    const { id } = await req.json();

    // Prevent deleting self
    if (id === currentAdminId) {
      return NextResponse.json(
        { message: "You cannot delete your own admin account" },
        { status: 400 }
      );
    }

    const adminCount = await Admin.countDocuments();
    if (adminCount <= 1) {
      return NextResponse.json(
        { message: "Cannot delete last admin" },
        { status: 400 }
      );
    }

    await Admin.findByIdAndDelete(id);
    return NextResponse.json({ message: "Admin deleted successfully" });
  } catch (err) {
    return NextResponse.json({ message: err.message }, { status: 401 });
  }
}
