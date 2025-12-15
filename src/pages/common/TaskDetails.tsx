import "./TaskDetails.css";
import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { getTask } from "../../api/tasks";

interface Task {
  id: number;
  title: string;
  description: string;
  category: string;
  priority: string;
  picture: string | null;
  latitude: number | null;
  longitude: number | null;
  point: number | null;
  status: string;
  createdAt: string;
  createdByUserId: number;
  createdByUser?: {
    firstName: string;
    lastName: string;
  };
  userTasks?: {
    user: {
      firstName: string;
      lastName: string;
    };
  }[];
}

export default function TaskDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [task, setTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchTask = async () => {
      try {
        if (!id) return;
        const response = await getTask(id);
        setTask(response.data);
      } catch (err) {
        console.error("Failed to fetch task", err);
        setError("Failed to load task details");
      } finally {
        setLoading(false);
      }
    };

    fetchTask();
  }, [id]);



  const getStatus = (task: Task): "pending-review" | "assigned" | "approved" | "completed" | "rejected" => {
    if (task.status === "rejected") return "rejected";
    if (task.status === "pending") return "pending-review";
    if (task.userTasks && task.userTasks.length > 0) return "assigned"; // Or in-progress
    return "approved";
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      "pending-review": "#fef3c7",
      approved: "#d1fae5",
      assigned: "#dbeafe",
      "in-progress": "#ede9fe",
      completed: "#d1fae5",
      rejected: "#fee2e2",
    };
    return colors[status] || "#f3f4f6";
  };

  const getStatusTextColor = (status: string) => {
    const colors: Record<string, string> = {
      "pending-review": "#92400e",
      approved: "#065f46",
      assigned: "#0c2d6b",
      "in-progress": "#5b21b6",
      completed: "#065f46",
      rejected: "#991b1b",
    };
    return colors[status] || "#6b7280";
  };

  const getTrashTypeIcon = (type: string) => {
    const icons: Record<string, string> = {
      plastic: "♻️",
      glass: "🍾",
      metal: "🔧",
      organic: "🌱",
      hazardous: "⚠️",
      mixed: "🗑️",
      other: "📦",
    };
    return icons[type.toLowerCase()] || "📦";
  };

  const getStatusIcon = (status: string) => {
    const icons: Record<string, string> = {
      "pending-review": "⏳",
      approved: "✅",
      assigned: "👤",
      "in-progress": "⚙️",
      completed: "🎉",
      rejected: "❌",
    };
    return icons[status] || "📋";
  };

  if (loading) return <div className="page loading">Loading task details...</div>;
  if (error) return <div className="page error">{error}</div>;
  if (!task) return <div className="page error">Task not found</div>;

  // const { title, description, trashType } = parseDescription(task.description);
  const { title, description, category } = task;
  const trashType = category || "mixed";
  const status = getStatus(task);
  const pictureUrl = task.picture ? `${process.env.REACT_APP_API_URL}${task.picture}` : "/trash.jpg";
  const reportedBy = task.createdByUser ? `${task.createdByUser.firstName} ${task.createdByUser.lastName}` : "Unknown";
  const assignedTo = task.userTasks && task.userTasks.length > 0
    ? `${task.userTasks[0].user.firstName} ${task.userTasks[0].user.lastName}`
    : null;

  return (
    <div className="page">
      <button className="back-btn" onClick={() => navigate(-1)}>
        ← Back
      </button>

      <div className="task-details-container">
        <div className="task-main">
          {/* Report Header */}
          <div className="task-header-section">
            <div>
              <h1>{title}</h1>
              <p className="task-meta">{getTrashTypeIcon(trashType)} {trashType} • Reported on {new Date(task.createdAt).toLocaleDateString()}</p>
            </div>
            <div className="status-badges">
              <span
                className="status-badge"
                style={{
                  backgroundColor: getStatusColor(status),
                  color: getStatusTextColor(status),
                }}
              >
                {getStatusIcon(status)} {status.replace(/-/g, " ").toUpperCase()}
              </span>
            </div>
          </div>

          {/* Trash Image */}
          <div className="task-image">
            <img src={pictureUrl} alt={title} onError={(e) => (e.currentTarget.src = "/trash.jpg")} />
          </div>

          {/* Report Information Grid */}
          <div className="task-info-grid">
            <div className="info-item">
              <span className="info-label">Location (GPS)</span>
              <span className="info-value">
                📍 {task.latitude?.toFixed(6)}, {task.longitude?.toFixed(6)}
              </span>
            </div>
            <div className="info-item">
              <span className="info-label">Reward Points</span>
              <span className="info-value points">⭐ {task.point} points</span>
            </div>
            <div className="info-item">
              <span className="info-label">Reported By</span>
              <span className="info-value">{reportedBy}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Assigned To</span>
              <span className="info-value">{assignedTo || "Not yet assigned"}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Trash Type</span>
              <span className="info-value">{getTrashTypeIcon(trashType)} {trashType}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Current Status</span>
              <span className="info-value">{getStatusIcon(status)} {status}</span>
            </div>
          </div>

          {/* Description Section */}
          <div className="description-section">
            <h2>📝 Description</h2>
            <div className="description-box">
              <p>{description}</p>
            </div>
          </div>

          {/* Map Section */}
          <div className="map-section">
            <h2>📍 Location Map</h2>
            <div className="map-container">
              {task.latitude && task.longitude ? (
                <iframe
                  title="Trash Location"
                  width="100%"
                  height="400"
                  frameBorder="0"
                  scrolling="no"
                  marginHeight={0}
                  marginWidth={0}
                  src={`https://www.openstreetmap.org/export/embed.html?bbox=${task.longitude - 0.01}%2C${task.latitude - 0.01}%2C${task.longitude + 0.01}%2C${task.latitude + 0.01}&layer=mapnik&marker=${task.latitude}%2C${task.longitude}`}
                  style={{ border: "1px solid #e5e7eb", borderRadius: "8px" }}
                ></iframe>
              ) : (
                <div className="map-placeholder">
                  <p>Location coordinates not available</p>
                </div>
              )}
            </div>
          </div>

        </div>

        {/* Sidebar */}
        <div className="task-sidebar">
          {/* Report Info Card */}
          <div className="sidebar-card">
            <h3>Report Info</h3>
            <div className="quick-info">
              <div className="info-row">
                <span>Reported By:</span>
                <strong>{reportedBy}</strong>
              </div>
              <div className="info-row">
                <span>Reward Points:</span>
                <strong style={{ color: "#10b981" }}>+{task.point}</strong>
              </div>
              <div className="info-row">
                <span>Reported:</span>
                <strong>{new Date(task.createdAt).toLocaleDateString()}</strong>
              </div>
              <div className="info-row">
                <span>Status:</span>
                <strong className={status === "completed" ? "completed" : "pending"}>
                  {getStatusIcon(status)} {status}
                </strong>
              </div>
            </div>
          </div>

          {/* Trash Type Info Card */}
          <div className="sidebar-card">
            <h3>Trash Type</h3>
            <div className="category-info">
              <p style={{ margin: "0 0 8px 0" }}>
                {getTrashTypeIcon(trashType)} {trashType.toUpperCase()}
              </p>
              <p
                style={{
                  margin: 0,
                  fontSize: "13px",
                  color: "#6b7280",
                  lineHeight: "1.5",
                }}
              >
                This is a {trashType} waste cleanup. Our volunteers will handle proper sorting and disposal.
              </p>
            </div>
          </div>

          {/* How It Works Card */}
          <div className="sidebar-card">
            <h3>How It Works</h3>
            <div className="how-it-works">
              <ol style={{ margin: 0, paddingLeft: "20px", color: "#6b7280", fontSize: "13px" }}>
                <li>You reported this trash location</li>
                <li>Admin reviews and approves</li>
                <li>Assigned to a cleaner</li>
                <li>Cleanup happens</li>
                <li>You earn points! ⭐</li>
              </ol>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
