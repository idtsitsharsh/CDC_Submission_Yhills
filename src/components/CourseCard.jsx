"use client"; // must have for client interactivity
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

const FALLBACK_IMAGE = "/course-placeholder.jpg";
function CourseImage({ src, alt }) {
    const safeSrc =
        typeof src === "string" && src.trim().length > 0
            ? src.trim()
            : FALLBACK_IMAGE;

    const [imgSrc, setImgSrc] = useState(safeSrc);

    // const [imgSrc, setImgSrc] = useState(src.trimEnd() || FALLBACK_IMAGE);

    return (
        <Image
        src={imgSrc}
        alt={alt}
        width={400}
        height={150}
        className="w-full h-[150px] object-cover rounded"
        unoptimized
        onError={() => {
            setImgSrc(FALLBACK_IMAGE);
        }}
        />
    );
}
export default function ClientCourseCard({ course }) {
  return (
    <Link href={`/courses/${course._id}`} key={course._id}>
      <div
        style={{
          border: "1px solid #ccc",
          padding: "1rem",
          borderRadius: "8px",
          width: "250px",
          cursor: "pointer",
        }}
      >
        <CourseImage src={course.thumbnail} alt={course.title} />
        <h3>{course.title}</h3>
        <p>Department: {course.department}</p>
        <p>Instructors: {course.instructors?.join(", ")}</p>
        <p>Price: ${course.price}</p>
      </div>
    </Link>
  );
}
