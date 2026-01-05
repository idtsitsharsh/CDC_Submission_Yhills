import Image from "next/image";
import { useState } from "react";

export default function CourseCard({ course,onDeleted }) {
  const FALLBACK_IMAGE = "/course-placeholder.jpg";

  // function getValidImage(src) {
  //   if (!src) return FALLBACK_IMAGE;
  //   if (src === "none") return FALLBACK_IMAGE;
  //   if (src.startsWith("http")) return src;
  //   return FALLBACK_IMAGE;
  // }
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

  return (
    <div style={{ border: "1px solid #ccc", padding: "1rem", width: "250px" }}>
      <CourseImage src={course.thumbnail} alt={course.title} />
      <h3>{course.title}</h3>
      <p>Department: {course.department}</p>
      <p>Language: {course.language}</p>
      <p>Instructors: {course.instructors.join(", ")}</p>
      <p>Price: ${course.price}</p>
      <button
        type="button"
        onClick={async () => {
          if (!confirm("Are you sure you want to delete this course?")) return;

          try {
            const res = await fetch(`/api/admin/courses/${course._id}`, {
              method: "DELETE",
            });
            const data = await res.json();

            if (res.ok) {
              alert(data.message || "Course deleted");
              onDeleted(course._id); // Notify parent to remove from UI
            } else {
              alert(data.message || "Delete failed");
            }
          } catch (err) {
            console.error(err);
            alert("Error deleting course");
          }
        }}
      >
        Delete
      </button>

    </div>
  );
}
