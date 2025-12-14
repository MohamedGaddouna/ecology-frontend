import "./TaskDetails.css";
import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";

interface TrashReport {
  id: string;
  title: string;
  description: string;
  picture: string;
  latitude: number;
  longitude: number;
  points: number;
  trashType: string;
  status: "pending-review" | "approved" | "assigned" | "in-progress" | "completed";
  createdAt: string;
  reportedBy: string;
  approvedAt?: string;
  assignedTo?: string;
  assignedAt?: string;
  completedAt?: string;
}

export default function TaskDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [acceptLoading, setAcceptLoading] = useState(false);

  // Mock data - ecology workflow
  const mockReport: TrashReport = {
    id: id || "1",
    title: "Trash pile near park entrance",
    description:
      "Large accumulation of mixed trash near the main entrance of Central Park. Includes plastic bags, bottles, paper waste, and some broken items. Located beside the north gate near the fountain.",
    picture: "/trash.jpg",
    latitude: 40.785091,
    longitude: -73.968285,
    points: 150,
    trashType: "mixed",
    status: "in-progress",
    createdAt: "2025-12-12",
    reportedBy: "John Doe",
    approvedAt: "2025-12-13",
    assignedTo: "Sarah Johnson",
    assignedAt: "2025-12-13T10:30:00",
    completedAt: undefined,
  };

  const handleAcceptTask = () => {
    setAcceptLoading(true);
    setTimeout(() => {
      // Simulate accepting task
      alert("Cleanup started! You'll earn ⭐ " + mockReport.points + " points when completed.");
      navigate("/user/reports");
    }, 1500);
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      "pending-review": "#fef3c7",
      approved: "#d1fae5",
      assigned: "#dbeafe",
      "in-progress": "#ede9fe",
      completed: "#d1fae5",
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
    return icons[type] || "📦";
  };

  const getStatusIcon = (status: string) => {
    const icons: Record<string, string> = {
      "pending-review": "⏳",
      approved: "✅",
      assigned: "👤",
      "in-progress": "⚙️",
      completed: "🎉",
    };
    return icons[status] || "📋";
  };

  const getStatusMessage = (status: string) => {
    const messages: Record<string, string> = {
      "pending-review": "Waiting for admin review...",
      approved: "✅ Approved! Waiting for assignment...",
      assigned: `👤 Assigned to ${mockReport.assignedTo} - Waiting to start...`,
      "in-progress": `⚙️ ${mockReport.assignedTo} is cleaning this up now...`,
      completed: `🎉 Completed! You earned ⭐ ${mockReport.points} points!`,
    };
    return messages[status] || "Unknown status";
  };

  return (
    <div className="page">
      <button className="back-btn" onClick={() => navigate("/user/reports")}>
        ← Back to Reports
      </button>

      <div className="task-details-container">
        <div className="task-main">
          {/* Report Header */}
          <div className="task-header-section">
            <div>
              <h1>{mockReport.title}</h1>
              <p className="task-meta">{getTrashTypeIcon(mockReport.trashType)} {mockReport.trashType} • Reported on {mockReport.createdAt}</p>
            </div>
            <div className="status-badges">
              <span
                className="status-badge"
                style={{
                  backgroundColor: getStatusColor(mockReport.status),
                  color: getStatusTextColor(mockReport.status),
                }}
              >
                {getStatusIcon(mockReport.status)} {mockReport.status.replace(/-/g, " ").toUpperCase()}
              </span>
            </div>
          </div>

          {/* Trash Image */}
          <div className="task-image">
            <img src={mockReport.picture} alt={mockReport.title} />
          </div>

          {/* Status Flow */}
          <div className="status-flow">
            <h2>📋 Cleanup Progress</h2>
            <p className="status-message">{getStatusMessage(mockReport.status)}</p>
          </div>

          {/* Report Information Grid */}
          <div className="task-info-grid">
            <div className="info-item">
              <span className="info-label">Location (GPS)</span>
              <span className="info-value">
                📍 {mockReport.latitude.toFixed(6)}, {mockReport.longitude.toFixed(6)}
              </span>
            </div>
            <div className="info-item">
              <span className="info-label">Reward Points</span>
              <span className="info-value points">⭐ {mockReport.points} points</span>
            </div>
            <div className="info-item">
              <span className="info-label">Reported By</span>
              <span className="info-value">{mockReport.reportedBy}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Assigned To</span>
              <span className="info-value">{mockReport.assignedTo || "Not yet assigned"}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Trash Type</span>
              <span className="info-value">{getTrashTypeIcon(mockReport.trashType)} {mockReport.trashType}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Current Status</span>
              <span className="info-value">{getStatusIcon(mockReport.status)} {mockReport.status}</span>
            </div>
          </div>

          {/* Description Section */}
          <div className="description-section">
            <h2>📝 Description</h2>
            <div className="description-box">
              <p>{mockReport.description}</p>
            </div>
          </div>

          {/* Map Section */}
          <div className="map-section">
            <h2>📍 Location Map</h2>
            <div className="map-placeholder">
              <p>
                Location: {mockReport.latitude.toFixed(4)}, {mockReport.longitude.toFixed(4)}
              </p>
              <p style={{ fontSize: "12px", color: "#9ca3af" }}>
                (Map integration would go here)
              </p>
            </div>
          </div>

          {/* Workflow Timeline */}
          <div className="workflow-section">
            <h2>⏱️ Workflow Timeline</h2>
            <div className="timeline">
              <div className={`timeline-item ${["pending-review", "approved", "assigned", "in-progress", "completed"].includes(mockReport.status) ? "completed" : ""}`}>
                <span className="timeline-icon">📢</span>
                <div>
                  <p className="timeline-label">Reported</p>
                  <p className="timeline-date">{mockReport.createdAt}</p>
                </div>
              </div>
              <div className={`timeline-item ${["approved", "assigned", "in-progress", "completed"].includes(mockReport.status) ? "completed" : ""}`}>
                <span className="timeline-icon">✅</span>
                <div>
                  <p className="timeline-label">Admin Approved</p>
                  <p className="timeline-date">{mockReport.approvedAt || "Pending..."}</p>
                </div>
              </div>
              <div className={`timeline-item ${["assigned", "in-progress", "completed"].includes(mockReport.status) ? "completed" : ""}`}>
                <span className="timeline-icon">👤</span>
                <div>
                  <p className="timeline-label">Assigned to {mockReport.assignedTo}</p>
                  <p className="timeline-date">{mockReport.assignedAt ? mockReport.assignedAt.split("T")[0] : "Pending..."}</p>
                </div>
              </div>
              <div className={`timeline-item ${["in-progress", "completed"].includes(mockReport.status) ? "completed" : ""}`}>
                <span className="timeline-icon">⚙️</span>
                <div>
                  <p className="timeline-label">Cleanup in Progress</p>
                  <p className="timeline-date">{mockReport.status === "in-progress" || mockReport.status === "completed" ? "In progress..." : "Waiting..."}</p>
                </div>
              </div>
              <div className={`timeline-item ${mockReport.status === "completed" ? "completed" : ""}`}>
                <span className="timeline-icon">🎉</span>
                <div>
                  <p className="timeline-label">Completed - You Earned ⭐ {mockReport.points} Points!</p>
                  <p className="timeline-date">{mockReport.completedAt || "Not yet completed"}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="action-buttons">
            {mockReport.status === "pending-review" && (
              <p className="info-message">⏳ Waiting for admin review...</p>
            )}
            {mockReport.status === "approved" && (
              <p className="info-message">✅ Your report has been approved! Waiting for assignment...</p>
            )}
            {mockReport.status === "assigned" && (
              <p className="info-message">👤 {mockReport.assignedTo} has been assigned. Cleanup will start soon!</p>
            )}
            {mockReport.status === "in-progress" && (
              <button className="btn-primary" onClick={() => alert("Cleanup is in progress!")}>
                ⚙️ View Cleanup Progress
              </button>
            )}
            {mockReport.status === "completed" && (
              <button className="btn-primary" disabled>
                🎉 Completed - You earned {mockReport.points} points!
              </button>
            )}
            <button className="btn-secondary" onClick={() => navigate("/user/reports")}>
              Back to Reports
            </button>
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
                <strong>{mockReport.reportedBy}</strong>
              </div>
              <div className="info-row">
                <span>Reward Points:</span>
                <strong style={{ color: "#10b981" }}>+{mockReport.points}</strong>
              </div>
              <div className="info-row">
                <span>Reported:</span>
                <strong>{mockReport.createdAt}</strong>
              </div>
              <div className="info-row">
                <span>Status:</span>
                <strong className={mockReport.status === "completed" ? "completed" : "pending"}>
                  {getStatusIcon(mockReport.status)} {mockReport.status}
                </strong>
              </div>
            </div>
          </div>

          {/* Trash Type Info Card */}
          <div className="sidebar-card">
            <h3>Trash Type</h3>
            <div className="category-info">
              <p style={{ margin: "0 0 8px 0" }}>
                {getTrashTypeIcon(mockReport.trashType)} {mockReport.trashType.toUpperCase()}
              </p>
              <p
                style={{
                  margin: 0,
                  fontSize: "13px",
                  color: "#6b7280",
                  lineHeight: "1.5",
                }}
              >
                This is a {mockReport.trashType} waste cleanup. Our volunteers will handle proper sorting and disposal.
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
