// src/app/components/CourseImage.jsx
"use client";

import { useState } from "react";
import Image from "next/image";

const FALLBACK_IMAGE = "/course-placeholder.jpg";

export default function CourseImage({ src, alt, width = 400, height = 150 }) {
  const [imgSrc, setImgSrc] = useState(src.trimEnd() || FALLBACK_IMAGE);

  return (
    <Image
      src={imgSrc}
      alt={alt}
      width={width}
      height={height}
      className="w-full h-[150px] object-cover rounded"
      unoptimized
      onError={() => setImgSrc(FALLBACK_IMAGE)}
    />
  );
}
