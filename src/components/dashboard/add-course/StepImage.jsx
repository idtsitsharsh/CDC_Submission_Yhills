"use client";

import Image from "next/image";
import { useState } from "react";

export default function StepImage({ data, setData }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleUpload(file) {
    if (!file) return;

    setLoading(true);
    setError("");

    try {
      const fd = new FormData();
      fd.append("file", file);

      const res = await fetch("/api/admin/upload-image", {
        method: "POST",
        body: fd,
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.message || "Upload failed");
      }
      setData((prev) => ({
        ...prev,
        thumbnail: result.url,
      }));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="step-content">
      <label className="input-label">
        Course Image
        <input
          type="file"
          accept="image/*"
          onChange={(e) => handleUpload(e.target.files[0])}
        />
      </label>

      {loading && <p className="hint">Uploading image...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {data.thumbnail && (
        <div style={{ marginTop: "1rem", maxWidth: "300px" }}>
          <p className="hint">Uploaded Image Preview:</p>
          <Image
            src={data.thumbnail}
            alt="Course thumbnail"
            width={300}
            height={200}
            style={{ borderRadius: "8px", objectFit: "cover" }}
          />
        </div>
      )}
    </div>
  );
}
