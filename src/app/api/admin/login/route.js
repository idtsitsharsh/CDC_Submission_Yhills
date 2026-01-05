import connectDB from "@/lib/db";
import Admin from "@/models/Admin";
import bcrypt from "bcryptjs";
import { signToken } from "@/lib/auth";

export async function POST(req) {
  try {
    await connectDB();

    const { email, password } = await req.json();

    if (!email || !password) {
      return Response.json(
        { success: false, message: "Missing email or password" },
        { status: 400 }
      );
    }

    const admin = await Admin.findOne({ email });

    if (!admin) {
      return Response.json(
        { success: false, message: "Invalid credentials" },
        { status: 401 }
      );
    }

    const isMatch = await bcrypt.compare(password, admin.password);

    if (!isMatch) {
      return Response.json(
        { success: false, message: "Invalid credentials" },
        { status: 401 }
      );
    }

    const token = signToken({
      id: admin._id.toString(),
      email: admin.email,
    });

    return Response.json({
      success: true,
      token,
      email: admin.email,
    });

  } catch (error) {
    console.error("LOGIN ERROR:", error);

    return Response.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}
