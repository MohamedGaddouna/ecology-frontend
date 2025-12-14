import "./UserTasks.css";

export default function UserTasks() {
  return (
    <div className="page">
      <h2>📋 My Tasks</h2>

      <div className="task-card pending">
        <img src="/trash.jpg" />
        <p>Status: ⏳ In Progress</p>
      </div>

      <div className="task-card done">
        <img src="/trash.jpg" />
        <p>Status: ✅ Finished</p>
        <p>⭐ Points earned</p>
      </div>
    </div>
  );
}
