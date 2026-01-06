export default function StepPricing({ data, setData }) {
  const handleChange = (field, value) => {
    setData({ ...data, [field]: value });
  };

  const addModule = () => {
    const newModule = { title: "", sessions: [] };
    setData({ ...data, curriculum: [...data.curriculum, newModule] });
  };

  const deleteModule = (index) => {
    const newCurriculum = [...data.curriculum];
    newCurriculum.splice(index, 1);
    setData({ ...data, curriculum: newCurriculum });
  };

  const addSession = (moduleIndex) => {
    const newCurriculum = [...data.curriculum];
    newCurriculum[moduleIndex].sessions.push({
      title: "",
      type: "video",
      duration: 0,
    });
    setData({ ...data, curriculum: newCurriculum });
  };

  const deleteSession = (moduleIndex, sessionIndex) => {
    const newCurriculum = [...data.curriculum];
    newCurriculum[moduleIndex].sessions.splice(sessionIndex, 1);
    setData({ ...data, curriculum: newCurriculum });
  };
  const updateModuleName = (index, value) => {
    const newCurriculum = [...data.curriculum];
    newCurriculum[index].title = value;
    setData({ ...data, curriculum: newCurriculum });
  };

  const updateSession = (moduleIndex, sessionIndex, field, value) => {
    const newCurriculum = [...data.curriculum];
    newCurriculum[moduleIndex].sessions[sessionIndex][field] = value;
    setData({ ...data, curriculum: newCurriculum });
  };

  return (
    <div className="step-content">
      {/* Price */}
      <label>
        Price (₹)
        <input
          type="number"
          value={data.price}
          onChange={(e) => handleChange("price", Number(e.target.value))}
        />
      </label>

      {/* Instructors */}
      <label style={{ marginTop: "1rem" }}>
        Instructors (comma separated)
        <input
          type="text"
          value={data.instructors.join(", ")}
          onChange={(e) =>
            handleChange("instructors", e.target.value.split(",").map(s => s.trim()))
          }
          placeholder="Enter instructor names"
        />
      </label>

      {/* Curriculum */}
      <div style={{ marginTop: "1rem" }}>
        <h4>Curriculum (Modules & Sessions)</h4>
        {data.curriculum.map((mod, mIndex) => (
          <div
            key={mIndex}
            style={{
              border: "1px solid #ddd",
              padding: "0.75rem",
              marginBottom: "1rem",
              borderRadius: "6px",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <input
                type="text"
                value={mod.title}
                onChange={(e) => updateModuleName(mIndex, e.target.value)}
                placeholder={`Module ${mIndex + 1} Name`}
                style={{ flex: 1, marginRight: "0.5rem" }}
              />
              <button type="button" onClick={() => deleteModule(mIndex)} style={actionBtnStyle}>
                Delete Module
              </button>
            </div>

            {/* Sessions */}
            <div style={{ marginTop: "0.5rem", paddingLeft: "1rem" }}>
              {mod.sessions.map((sess, sIndex) => (
                <div
                  key={sIndex}
                  style={{ display: "flex", gap: "0.5rem", marginBottom: "0.5rem" }}
                >
                  <input
                    type="text"
                    value={sess.title}
                    onChange={(e) => updateSession(mIndex, sIndex, "title", e.target.value)}
                    placeholder="Session Name"
                  />
                  <select
                    value={sess.type}
                    onChange={(e) => updateSession(mIndex, sIndex, "type", e.target.value)}
                  >
                    <option value="video">Video</option>
                    <option value="blog">Blog</option>
                  </select>
                  <input
                    type="number"
                    value={sess.duration}
                    onChange={(e) => updateSession(mIndex, sIndex, "duration", Number(e.target.value))}
                    placeholder="Duration (mins)"
                    style={{ width: "100px" }}
                  />
                  <button type="button" onClick={() => deleteSession(mIndex, sIndex)} style={actionBtnStyle}>
                    Delete
                  </button>
                </div>
              ))}
              <button type="button" onClick={() => addSession(mIndex)} style={buttonStyle}>
                + Add Session
              </button>
            </div>
          </div>
        ))}

        <button type="button" onClick={addModule} style={buttonStyle}>
          + Add Module
        </button>
      </div>
    </div>
  );
}

const buttonStyle = {
  padding: "0.5rem 0.75rem",
  borderRadius: "6px",
  border: "none",
  backgroundColor: "#2563eb",
  color: "#fff",
  cursor: "pointer",
  marginTop: "0.5rem",
};

const actionBtnStyle = {
  padding: "0.25rem 0.5rem",
  borderRadius: "6px",
  border: "1px solid #ccc",
  background: "white",
  cursor: "pointer",
};
