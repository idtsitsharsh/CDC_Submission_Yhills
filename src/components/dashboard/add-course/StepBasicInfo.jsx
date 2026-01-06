export default function StepBasicInfo({ data, setData }) {
  return (
    <div className="step-content">
      <label>
        Course Title
        <input
          value={data.title}
          onChange={e => setData({ ...data, title: e.target.value })}
        />
      </label>

      <label>
        Description
        <textarea
          rows={4}
          value={data.description}
          onChange={e => setData({ ...data, description: e.target.value })}
        />
      </label>
      <label>
        Department
        <input
            value={data.department}
            onChange={(e) => setData({ ...data, department: e.target.value })}
        />
        </label>
    </div>
  );
}
