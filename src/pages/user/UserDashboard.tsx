import "./UserDashboard.css";

export default function UserDashboard() {
  return (
    <div className="page">
      <div className="card">
        <h2>🌱 Welcome Back</h2>
        <p>Help clean the environment and earn points.</p>

        <button className="primary-btn">➕ Report Trash</button>
      </div>
    </div>
  );
}
