import "./MyTasks.css";

export default function MyTasks() {
  return (
    <div className="page">
      <h2>🧹 Assigned Tasks</h2>

      <div className="task-card">
        <img src="/trash.jpg" />

        <p>Status: In Progress</p>

        <button className="primary-btn">
          ✔ Mark as Finished
        </button>
      </div>
    </div>
  );
}
