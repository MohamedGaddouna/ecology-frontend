import "./AdminDashboard.css";

export default function AdminDashboard() {
  return (
    <div className="page">
      <h2>🛠 Admin Dashboard</h2>

      <div className="card">
        <p>New task reported</p>
        <button className="primary-btn">Assign to Employee</button>
      </div>
    </div>
  );
}
