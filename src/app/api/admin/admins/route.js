import connectDB from "@/lib/db";
import Admin from "@/models/Admin";
import bcrypt from "bcryptjs";
import { verifyToken } from "@/lib/auth";

export async function GET(req) {
  verifyToken(req);
  await connectDB();

  const admins = await Admin.find().select("-password");
  return Response.json({ admins });
}

export async function POST(req) {
  verifyToken(req);
  await connectDB();

  const { email, password } = await req.json();

  if (!email || !password) {
    return Response.json(
      { message: "Email and password required" },
      { status: 400 }
    );
  }

  const existing = await Admin.findOne({ email });
  if (existing) {
    return Response.json(
      { message: "Admin already exists" },
      { status: 409 }
    );
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const admin = await Admin.create({
    email,
    password: hashedPassword,
  });

  return Response.json({
    admin: { _id: admin._id, email: admin.email },
  });
}

export async function DELETE(req) {
  verifyToken(req);
  await connectDB();

  const { id } = await req.json();

  const adminCount = await Admin.countDocuments();
  if (adminCount <= 1) {
    return Response.json(
      { message: "Cannot delete last admin" },
      { status: 400 }
    );
  }

  await Admin.findByIdAndDelete(id);
  return Response.json({ message: "Admin deleted" });
}
