import "./AssignTask.css";

export default function AssignTask() {
  return (
    <div className="page">
      <div className="card">
        <h2>👷 Assign Task</h2>

        <select>
          <option>Select employee</option>
        </select>

        <button className="primary-btn">Assign</button>
      </div>
    </div>
  );
}
