"use client";

import { useState} from "react";

export default function EditCourseForm({ course, onUpdated, onCancel }) {
  const [title, setTitle] = useState(course.title || "");
  const [department, setDepartment] = useState(course.department || "");
  const [instructors, setInstructors] = useState(
    course.instructors?.join(", ") || ""
  );
  const [thumbnail, setThumbnail] = useState(course.thumbnail || "");
  const [thumbnailFile, setThumbnailFile] = useState("");
  const [description, setDescription] = useState(course.description || "");
  const [language, setLanguage] = useState(
    course.language?.join(", ") || ""
  );
  const [price, setPrice] = useState(course.price || 0); 
  const [curriculum, setCurriculum] = useState(() => Array.isArray(course.curriculum) ? course.curriculum : []);
  
  /* ---------- Module handlers ---------- */
  const addModule = () => {
    setCurriculum([...curriculum, { title: "", sessions: [] }]);
  };

  const removeModule = (index) => {
    setCurriculum(curriculum.filter((_, i) => i !== index));
  };

  const updateModuleTitle = (index, value) => {
    const updated = [...curriculum];
    updated[index].title = value;
    setCurriculum(updated);
  };

  /* ---------- Session handlers ---------- */
  const addSession = (moduleIndex) => {
    const updated = [...curriculum];
    updated[moduleIndex].sessions.push({
      title: "",
      type: "video",
      duration: 0,
    });
    setCurriculum(updated);
  };

  const removeSession = (moduleIndex, sessionIndex) => {
    const updated = [...curriculum];
    updated[moduleIndex].sessions.splice(sessionIndex, 1);
    setCurriculum(updated);
  };

  const updateSession = (moduleIndex, sessionIndex, field, value) => {
    const updated = [...curriculum];
    updated[moduleIndex].sessions[sessionIndex][field] =
      field === "duration" ? Number(value) : value;
    setCurriculum(updated);
  };

  /* ---------- Submit ---------- */
  const handleSubmit = async (e) => {
    e.preventDefault();
    let finalThumbnail = thumbnail;

    if (thumbnailFile) {
      const formData = new FormData();
      formData.append("file", thumbnailFile);

      const uploadRes = await fetch("/api/admin/courses/upload", {
        method: "POST",
        body: formData,
      });

      const uploadData = await uploadRes.json();
      finalThumbnail = uploadData.path;
    }
    const updatedCourse = {
      title,
      department,
      description,
      language: language.split(",").map(l => l.trim()).filter(Boolean),
      instructors: instructors.split(",").map((i) => i.trim()),
      thumbnail: finalThumbnail || "", // optional
      curriculum,
      price:price||0,
    };

    try {
      const res = await fetch(`/api/admin/courses/${course._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedCourse),
      });

      const data = await res.json();

      if (data.course) {
        onUpdated(data.course);
        onCancel(); // ✅ CLOSE editor after save
      } else {
        alert(data.message || "Update failed");
      }
    } catch (err) {
      console.error(err);
      alert("Error updating course");
    }
  };

  return (
    <form style={{ border: "1px solid #ccc", padding: "1rem", borderRadius: 8 }}>
      <h3>Edit Course</h3>

      <label>Title</label>
      <input value={title} onChange={(e) => setTitle(e.target.value)} required />

      <label>Department</label>
      <input
        value={department}
        onChange={(e) => setDepartment(e.target.value)}
        required
      />

      <label>Description</label>
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      <label>Language</label>
      <input
        value={language}
        onChange={(e) => setLanguage(e.target.value)}
      />

      <label>Instructors (comma separated)</label>
      <input
        value={instructors}
        onChange={(e) => setInstructors(e.target.value)}
      />

      <label>Thumbnail URL (optional):</label>
      <input
        value={thumbnail}
        onChange={(e) => setThumbnail(e.target.value)}
      />

      <label>OR Upload Image:</label>
      <input
        type="file"
        accept="image/*"
        onChange={(e) => setThumbnailFile(e.target.files[0])}
      />
      <label>Price (in USD)</label>
      <input  type="number"  value={price}  onChange={(e) => setPrice(Number(e.target.value))}  min="0"  placeholder="Enter course price" required/>

      <h4>Curriculum</h4>

      {curriculum.map((module, moduleIndex) => (
        <div key={moduleIndex} style={{ marginBottom: "1rem" }}>
          <input
            placeholder="Module title"
            value={module.title}
            onChange={(e) =>
              updateModuleTitle(moduleIndex, e.target.value)
            }
          />
          <button type="button" onClick={() => removeModule(moduleIndex)}>
            Remove Module
          </button>

          {module.sessions.map((session, sessionIndex) => (
            <div key={sessionIndex} style={{ marginLeft: "1rem" }}>
              <input
                placeholder="Session title"
                value={session.title}
                onChange={(e) =>
                  updateSession(moduleIndex, sessionIndex, "title", e.target.value)
                }
              />

              <select
                value={session.type}
                onChange={(e) =>
                  updateSession(moduleIndex, sessionIndex, "type", e.target.value)
                }
              >
                <option value="video">Video</option>
                <option value="blog">Blog</option>
              </select>

              <input
                type="number"
                placeholder="Duration"
                value={session.duration}
                onChange={(e) =>
                  updateSession(
                    moduleIndex,
                    sessionIndex,
                    "duration",
                    e.target.value
                  )
                }
              />

              <button
                type="button"
                onClick={() => removeSession(moduleIndex, sessionIndex)}
              >
                Remove Session
              </button>
            </div>
          ))}

          <button type="button" onClick={() => addSession(moduleIndex)}>
            Add Session
          </button>
        </div>
      ))}

      <button type="button" onClick={addModule}>
        Add Module
      </button>

      <div style={{ marginTop: "1rem" }}>
        <button onClick={handleSubmit}>Save Changes</button>
        <button type="button" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </form>
  );
}
