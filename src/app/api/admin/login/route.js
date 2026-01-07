import connectDB from "@/lib/db";
import Admin from "@/models/Admin";
import bcrypt from "bcryptjs";
import { signToken } from "@/lib/auth";
import { NextResponse } from "next/server";
import { z } from "zod";
import { validate, validationError } from "@/lib/validators/validate";

const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export async function POST(req) {
  try {
    await connectDB();
    console.log("✅ DB connected for login");

    const body = await req.json();
    console.log("Login payload:", body);

    const parsed = validate(LoginSchema, body);
    if (!parsed.success) {
      console.log("Login validation failed:", parsed.errors);
      return validationError(parsed.errors);
    }

    const { email, password } = parsed.data;
    const admin = await Admin.findOne({ email });
    if (!admin) {
      console.log("Admin not found for email:", email);
      return NextResponse.json(
        { success: false, message: "Invalid credentials" },
        { status: 401 }
      );
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      console.log("Password mismatch for admin:", email);
      return NextResponse.json(
        { success: false, message: "Invalid credentials" },
        { status: 401 }
      );
    }

    const token = signToken({ id: admin._id.toString(), email: admin.email });
    console.log("JWT token generated:", token);

    const response = NextResponse.json({ success: true, email: admin.email });

    response.cookies.set("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 60 * 60,
      path: "/",
    });

    console.log("Cookie set in response:", response.cookies.get("token"));

    return response;
  } catch (error) {
    console.error("LOGIN ERROR:", error);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}
