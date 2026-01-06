"use client";

import { useState } from "react";

export default function AddCourseForm({ onAdded }) {
  const [title, setTitle] = useState("");
  const [department, setDepartment] = useState("");
  const [language, setLanguage] = useState("");
  const [description, setDescription] = useState("");
  const [instructors, setInstructors] = useState("");
  const [thumbnail, setThumbnail] = useState("");
  const [thumbnailFile, setThumbnailFile] = useState("");
  const [price, setPrice] = useState(0);
  const [curriculum, setCurriculum] = useState([]);

  const addModule = () => {
    setCurriculum([...curriculum, { title: "", sessions: [] }]);
  };

  const removeModule = (index) => {
    const updated = [...curriculum];
    updated.splice(index, 1);
    setCurriculum(updated);
  };

  const updateModuleTitle = (index, value) => {
    const updated = [...curriculum];
    updated[index].title = value;
    setCurriculum(updated);
  };

  const addSession = (moduleIndex) => {
    const updated = [...curriculum];
    updated[moduleIndex].sessions.push({ title: "", type: "video", duration: 0 });
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    let finalThumbnail = thumbnail;

    if (thumbnailFile) {
      const formData = new FormData();
      formData.append("file", thumbnailFile);

      const uploadRes = await fetch("/api/admin/courses/upload", {
        method: "POST",
        body: formData,
        credentials: "include",
      });

      const uploadData = await uploadRes.json();

      if (!uploadData.path) {
        alert("Image upload failed");
        return;
      }

      finalThumbnail = uploadData.path; 
    }


    const newCourse = {
      title,
      department,
      language: language.split(",").map(l => l.trim()).filter(Boolean),
      description,
      instructors: instructors.split(",").map(i => i.trim()),
      thumbnail: finalThumbnail || "",
      curriculum,
      price: price || 0,
    };

    const res = await fetch("/api/admin/courses", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include", 
      body: JSON.stringify(newCourse),
    });

    const data = await res.json();

    if (data.course) {
      onAdded(data.course);
      setTitle("");
      setDepartment("");
      setLanguage("");
      setDescription("");
      setInstructors("");
      setThumbnail("");
      setThumbnailFile("");
      setCurriculum([]);
      setPrice(0);
    } else {
      alert(data.message || "Failed to add course");
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ border: "1px solid #ccc", padding: "1rem", borderRadius: "8px" }}>
      <h3>Add New Course</h3>

      <label>Title:</label>
      <input value={title} onChange={(e) => setTitle(e.target.value)} required />

      <label>Department:</label>
      <input value={department} onChange={(e) => setDepartment(e.target.value)} required />

      <label>Language:</label>
      <input value={language} onChange={(e) => setLanguage(e.target.value)} required />

      <label>Description:</label>
      <textarea value={description} onChange={(e) => setDescription(e.target.value)} required />

      <label>Instructors (comma separated):</label>
      <input value={instructors} onChange={(e) => setInstructors(e.target.value)} required />

      <label>Thumbnail URL (optional):</label>
      <input value={thumbnail} onChange={(e) => setThumbnail(e.target.value)} />

      <label>OR Upload Image:</label>
      <input type="file" accept="image/*" onChange={(e) => setThumbnailFile(e.target.files[0])} />

      <label>Price (in USD)</label>
      <input type="number" value={price} onChange={(e) => setPrice(Number(e.target.value))} min="0" placeholder="Enter course price" required/>

      <h4>Curriculum</h4>
      {curriculum.map((module, moduleIndex) => (
        <div key={moduleIndex} style={{ border: "1px solid #ddd", padding: "0.5rem", marginBottom: "1rem" }}>
          <label>Module Title:</label>
          <input value={module.title} onChange={(e) => updateModuleTitle(moduleIndex, e.target.value)} required />
          <button type="button" onClick={() => removeModule(moduleIndex)}>Remove Module</button>

          <div style={{ marginLeft: "1rem" }}>
            {module.sessions.map((session, sessionIndex) => (
              <div key={sessionIndex} style={{ border: "1px dashed #ccc", padding: "0.5rem", marginBottom: "0.5rem" }}>
                <label>Session Title:</label>
                <input value={session.title} onChange={(e) => updateSession(moduleIndex, sessionIndex, "title", e.target.value)} required />

                <label>Type:</label>
                <select value={session.type} onChange={(e) => updateSession(moduleIndex, sessionIndex, "type", e.target.value)}>
                  <option value="video">Video</option>
                  <option value="blog">Blog</option>
                </select>

                <label>Duration (minutes):</label>
                <input type="number" value={session.duration} onChange={(e) => updateSession(moduleIndex, sessionIndex, "duration", e.target.value)} required />

                <button type="button" onClick={() => removeSession(moduleIndex, sessionIndex)}>Remove Session</button>
              </div>
            ))}
            <button type="button" onClick={() => addSession(moduleIndex)}>Add Session</button>
          </div>
        </div>
      ))}

      <button type="button" onClick={addModule}>Add Module</button>
      <br /><br />
      <button type="submit">Add Course</button>
    </form>
  );
}
