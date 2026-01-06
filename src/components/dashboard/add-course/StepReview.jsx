import Image from "next/image";

export default function StepReview({ data }) {
  return (
    <div className="step-content">
      <p><strong>Title:</strong> {data.title}</p>
      <p><strong>Description:</strong> {data.description}</p>
      <p><strong>Department:</strong> {data.department}</p>
      <p><strong>Price:</strong> ₹{data.price}</p>
      <p><strong>Instructors:</strong> {data.instructors.join(", ") || "-"}</p>

      <div style={{ marginTop: "1rem" }}>
        <strong>Curriculum:</strong>
        {data.curriculum.length === 0 ? (
          <p>No modules added</p>
        ) : (
          data.curriculum.map((mod, mIndex) => (
            <div key={mIndex} style={{ marginBottom: "0.75rem", paddingLeft: "1rem" }}>
              <p><em>Module {mIndex + 1}: {mod.title || "-"}</em></p>
              {mod.sessions.length === 0 ? (
                <p style={{ paddingLeft: "1rem" }}>No sessions</p>
              ) : (
                mod.sessions.map((sess, sIndex) => (
                  <p key={sIndex} style={{ paddingLeft: "1rem" }}>
                    - {sess.title || "-"} ({sess.type}, {sess.duration} mins)
                  </p>
                ))
              )}
            </div>
          ))
        )}
      </div>

        {data.thumbnail && (
        <div style={{ marginTop: "1rem" }}>
            <p className="hint">Thumbnail Preview</p>

            <div
            style={{
                width: "300px",
                height: "180px",
                position: "relative",
                borderRadius: "8px",
                overflow: "hidden",
            }}
            >
            <Image
                src={data.thumbnail}
                alt="Thumbnail"
                fill
                style={{ objectFit: "cover" }}
                sizes="300px"
                priority
            />
            </div>
        </div>
        )}


    </div>
  );
}
