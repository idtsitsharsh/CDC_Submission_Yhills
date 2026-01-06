export default function StepIndicator({ steps = [], current = 0 }) {
  if (!Array.isArray(steps) || steps.length === 0) return null;

  return (
    <div className="step-indicator">
      {steps.map((step, index) => (
        <div
          key={index}
          className={`step-item ${index <= current ? "active" : ""}`}
        >
          <div className="step-dot">{index + 1}</div>
          <span>{step}</span>
        </div>
      ))}
    </div>
  );
}
