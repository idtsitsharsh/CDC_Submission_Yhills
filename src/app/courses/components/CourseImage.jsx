"use client";

import { useState } from "react";
import Image from "next/image";

const FALLBACK_IMAGE = "/course-placeholder.jpg";

export default function CourseImage({
  src,
  alt,
  variant = "card", // "card" | "detail"
}) {
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
