import { writeFile } from "fs/promises";
import path from "path";

export const runtime = "nodejs"; // ✅ REQUIRED for fs

export async function POST(req) {
  try {
    const data = await req.formData();
    const file = data.get("file");

    if (!file) {
      return Response.json(
        { message: "No file uploaded" },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const fileName = `${Date.now()}-${file.name.replace(/\s/g, "")}`;
    const uploadDir = path.join(process.cwd(), "public/uploads");
    const uploadPath = path.join(uploadDir, fileName);

    await writeFile(uploadPath, buffer);

    return Response.json({
      path: `/uploads/${fileName}`,
    });
  } catch (err) {
    console.error("UPLOAD ERROR:", err);
    return Response.json(
      { message: "Upload failed" },
      { status: 500 }
    );
  }
}
