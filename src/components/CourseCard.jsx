"use client"; 
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

const FALLBACK_IMAGE = "/course-placeholder.jpg";
function CourseImage({ src, alt }) {
  const variant="card";
  const safeSrc =
    typeof src === "string" && src.trim().length > 0
      ? src.trim()
      : FALLBACK_IMAGE;

  const [imgSrc, setImgSrc] = useState(safeSrc);

  return (
    <div className={`course-image-wrapper ${variant}`}>
      <Image
        src={imgSrc}
        alt={alt}
        fill
        unoptimized
        className="course-image"
        onError={() => setImgSrc(FALLBACK_IMAGE)}
      />
    </div>
  );
}

export default function ClientCourseCard({ course }) {
  return (
    <Link href={`/courses/${course._id}`} key={course._id}>
      <div className="course-card" >
        <CourseImage src={course.thumbnail} alt={course.title} variant="card"/>
        <h3>{course.title}</h3>
        <p>Department: {course.department}</p>
        <p>Instructors: {course.instructors?.join(", ")}</p>
        <p className="course-price">Price: ${course.price}</p>
      </div>
    </Link>
  );
}
