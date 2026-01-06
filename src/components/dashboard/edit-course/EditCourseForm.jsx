"use client";

import { useState } from "react";
import Image from "next/image";
// import { z } from "zo    d";

export default function EditCourseForm({ course, onBack }) {
  const [form, setForm] = useState(structuredClone(course));
  const [saving, setSaving] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [error, setError] = useState("");

// const CourseSchema = z.object({
//   title: z.string().min(3),
//   department: z.string().min(2),

//   instructors: z.array(z.string()).optional().default([]),

//   thumbnail: z.string().url().optional(),
//   description: z.string().optional(),

//   language: z.array(z.string()).optional().default([]),

//   curriculum: z.array(
//     z.object({
//       title: z.string(),
//       sessions: z.array(
//         z.object({
//           title: z.string(),
//           type: z.enum(["video", "blog"]),
//           duration: z.number().min(0),
//         })
//       ).optional().default([]),
//     })
//   ).optional().default([]),

//   price: z.number().nonnegative().optional(),
// });

  const updateField = (key, value) => setForm({ ...form, [key]: value });

  const updateModule = (i, key, value) => {
    const updated = [...form.curriculum];
    updated[i][key] = value;
    setForm({ ...form, curriculum: updated });
  };

  const updateSession = (mi, si, key, value) => {
    const updated = [...form.curriculum];
    updated[mi].sessions[si][key] = value;
    setForm({ ...form, curriculum: updated });
  };

    const uploadImage = async () => {
    if (!form.newThumbnail) return form.thumbnail;
    const fd = new FormData();
    fd.append("file", form.newThumbnail);

    const res = await fetch("/api/admin/upload-image", {
        method: "POST",
        body: fd,
        credentials: "include",
    });

    if (!res.ok) throw new Error("Image upload failed");

    const data = await res.json();

    return data.url;
    };


  const updateCourse = async () => {
    setError("");
    try {
      setSaving(true);
    // console.log("=== Update Course Debug ===");
    // console.log("Course prop:", course);
    // console.log("Form state:", form);
    // console.log("Course _id from prop:", course?._id);
    // console.log("Course _id from form:", form?._id);
        const thumbnailUrl = await uploadImage();

        const payload = { ...form };

        if (form.newThumbnail) {
        payload.thumbnail = thumbnailUrl;
        } else if (!form.thumbnail || form.thumbnail === ""){
        delete payload.thumbnail;
        }

        delete payload.newThumbnail;

    // console.log("Payload to send:", payload);

      const res = await fetch(`/api/admin/courses/${course._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });
    // console.log("Fetch response object:", res);
      const data = await res.json();
    // console.log("Response data:", data);
      if (!res.ok) throw new Error(data.message || "Failed to update course");

      alert("✅ Course updated successfully");
    //   onSuccess();
    } catch (err) {
      console.error(err);
      setError(err.message || "Server error");
    } finally {
      setSaving(false);
    }
  };

  const deleteCourse = async () => {
    if (!confirm("Are you sure? This cannot be undone.")) return;

    try {
      const res = await fetch(`/api/admin/courses/${course._id}`, {
        method: "DELETE",
        credentials: "include",
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to delete course");

      alert("Course deleted successfully");
    //   onSuccess(); 
    } catch (err) {
      console.error(err);
      alert(err.message || "Failed to delete course");
    }
  };

  return (
    <div className="edit-form">
      <button className="btn-secondary" onClick={onBack}>
        ← Back
      </button>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <h3>Basic Information</h3>

      <label>
        Title
        <input
          value={form.title}
          onChange={e => updateField("title", e.target.value)}
        />
      </label>

      <label>
        Description
        <textarea
          value={form.description}
          onChange={e => updateField("description", e.target.value)}
        />
      </label>

      <label>
        Department
        <input
          value={form.department || ""}
          onChange={e => updateField("department", e.target.value)}
        />
      </label>

      <label>
        Price
        <input
        type="number"
        value={form.price}
        onChange={e =>
            updateField(
            "price",
            e.target.value === "" ? 0 : Number(e.target.value)
            )
        }
        />
      </label>

      <label>
        Course Thumbnail
        <input
          type="file"
          accept="image/*"
          onChange={e => updateField("newThumbnail", e.target.files[0])}
        />
      </label>

        {(form.thumbnail || form.newThumbnail) && (
        <div style={{ marginTop: "0.5rem", maxWidth: "300px" }}>
            <Image
            src={
                form.newThumbnail
                ? URL.createObjectURL(form.newThumbnail)
                : form.thumbnail
            }
            alt="Course Thumbnail"
            width={300}
            height={180}
            style={{ borderRadius: "6px", objectFit: "cover" }}
            unoptimized
            />
        </div>
        )}


      <h3>Instructors</h3>
      {form.instructors?.map((ins, i) => (
        <div key={i} className="inline-row">
          <input
            value={ins}
            onChange={e => {
              const list = [...form.instructors];
              list[i] = e.target.value;
              updateField("instructors", list);
            }}
          />
          <button
            onClick={() =>
              updateField("instructors", form.instructors.filter((_, x) => x !== i))
            }
          >
            ✕
          </button>
        </div>
      ))}
      <button
        className="btn-secondary"
        onClick={() =>
          updateField("instructors", [...(form.instructors || []), ""])
        }
      >
        + Add Instructor
      </button>

      {/* Curriculum Section remains unchanged */}
      <h3>Curriculum</h3>
      {form.curriculum?.map((mod, mi) => (
        <div key={mi} className="module-box">
          <input
            value={mod.title}
            placeholder="Module title"
            onChange={e => updateModule(mi, "title", e.target.value)}
          />

          {mod.sessions?.map((s, si) => (
            <div key={si} className="session-box">
              <input
                value={s.title}
                placeholder="Session title"
                onChange={e => updateSession(mi, si, "title", e.target.value)}
              />
                <select
                value={s.type}
                onChange={e => updateSession(mi, si, "type", e.target.value)}
                >
                <option value="video">Video</option>
                <option value="blog">Blog</option>
                </select>

                <input
                type="number"
                value={s.duration}
                onChange={e =>
                    updateSession(
                    mi,
                    si,
                    "duration",
                    e.target.value === "" ? 0 : Number(e.target.value)
                    )
                }
                />

            </div>
          ))}

          <button
            className="btn-secondary"
            onClick={() => {
              const updated = [...form.curriculum];
              updated[mi].sessions.push({ title: "", type: "video", duration: 0 });
              setForm({ ...form, curriculum: updated });
            }}
          >
            + Add Session
          </button>
        </div>
      ))}
      <button
        className="btn-secondary"
        onClick={() =>
          setForm({
            ...form,
            curriculum: [...(form.curriculum || []), { title: "New Module", sessions: [] }],
          })
        }
      >
        + Add Module
      </button>

      <button
        className="btn-primary"
        onClick={updateCourse}
        disabled={saving}
      >
        {saving ? "Saving..." : "Update Course"}
      </button>

      <div className="danger-zone">
        <h4>Danger Zone</h4>
        {!confirmDelete ? (
          <button
            className="btn-danger"
            onClick={() => setConfirmDelete(true)}
          >
            Delete Course
          </button>
        ) : (
          <>
            <p>Are you sure? This cannot be undone.</p>
            <button className="btn-danger" onClick={deleteCourse}>
              Yes, Delete
            </button>
            <button
              className="btn-secondary"
              onClick={() => setConfirmDelete(false)}
            >
              Cancel
            </button>
          </>
        )}
      </div>
    </div>
  );
}
