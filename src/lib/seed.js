import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import connectDB from "./db.js";
import Course from "../models/Course.js";

async function seed() {
  await connectDB();
  await Course.deleteMany();

  await Course.create({
    title: "Full Stack Web Development",
    department: "Computer Science",
    thumbnail: "https://placehold.co/600x400",
    instructors: ["John Doe", "Jane Smith"],
    description: "Learn full stack web development from basics to advanced.",
    languages: ["English"],
    curriculum: [
      {
        title: "Frontend Basics",
        sessions: [
          { title: "HTML & CSS", type: "video", duration: 60 },
          { title: "JavaScript Basics", type: "video", duration: 90 },
        ],
      },
      {
        title: "Backend Basics",
        sessions: [
          { title: "Node.js Intro", type: "video", duration: 75 },
          { title: "Express & APIs", type: "blog", duration: 45 },
        ],
      },
    ],
  });

  console.log("✅ Sample course seeded");
  process.exit(0);
}

seed();
