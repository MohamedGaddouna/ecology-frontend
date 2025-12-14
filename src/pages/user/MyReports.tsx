import "./MyReports.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

interface Report {
  id: string;
  title: string;
  description: string;
  picture: string;
  latitude: number;
  longitude: number;
  points: number;
  trashType: string;
  status: "pending-review" | "approved" | "assigned" | "in-progress" | "completed";
  reportedAt: string;
  approvedAt?: string;
  completedAt?: string;
  assignedTo?: string;
  pointsEarned: boolean;
}

export default function MyReports() {
  const navigate = useNavigate();
  const [filterStatus, setFilterStatus] = useState<"all" | "pending-review" | "approved" | "assigned" | "in-progress" | "completed">("all");
  const [sortBy, setSortBy] = useState<"recent" | "points">("recent");

  // Mock data
  const mockReports: Report[] = [
    {
      id: "1",
      title: "Trash pile near park entrance",
      description: "Large accumulation of mixed trash including plastic bags, bottles, and paper waste scattered near the main entrance.",
      picture: "/trash.jpg",
      latitude: 40.785091,
      longitude: -73.968285,
      points: 150,
      trashType: "mixed",
      status: "completed",
      reportedAt: "2025-12-10",
      approvedAt: "2025-12-10",
      completedAt: "2025-12-12",
      assignedTo: "Sarah Johnson",
      pointsEarned: true,
    },
    {
      id: "2",
      title: "Plastic waste behind mall",
      description: "Scattered plastic waste and takeout containers behind the shopping mall. Mostly shopping bags and food packaging.",
      picture: "/trash.jpg",
      latitude: 40.758896,
      longitude: -73.985130,
      points: 100,
      trashType: "plastic",
      status: "in-progress",
      reportedAt: "2025-12-08",
      approvedAt: "2025-12-08",
      assignedTo: "Mike Chen",
      pointsEarned: false,
    },
    {
      id: "3",
      title: "Glass bottles on river bank",
      description: "Multiple broken glass bottles scattered along the river bank. Hazardous for pedestrians and wildlife.",
      picture: "/trash.jpg",
      latitude: 40.788988,
      longitude: -73.968283,
      points: 200,
      trashType: "glass",
      status: "pending-review",
      reportedAt: "2025-12-13",
      pointsEarned: false,
    },
  ];

  const filteredReports = mockReports.filter((report) => {
    if (filterStatus === "all") return true;
    return report.status === filterStatus;
  });

  const sortedReports = [...filteredReports].sort((a, b) => {
    if (sortBy === "recent") {
      return new Date(b.reportedAt).getTime() - new Date(a.reportedAt).getTime();
    } else {
      return b.points - a.points;
    }
  });

  const getStatusInfo = (status: string) => {
    const statuses: Record<string, { icon: string; label: string; color: string; bg: string; text: string }> = {
      "pending-review": {
        icon: "⏳",
        label: "Pending Review",
        color: "#f59e0b",
        bg: "#fef3c7",
        text: "#92400e",
      },
      approved: {
        icon: "✅",
        label: "Approved",
        color: "#10b981",
        bg: "#d1fae5",
        text: "#065f46",
      },
      assigned: {
        icon: "👤",
        label: "Assigned",
        color: "#3b82f6",
        bg: "#dbeafe",
        text: "#0c2d6b",
      },
      "in-progress": {
        icon: "⚙️",
        label: "In Progress",
        color: "#8b5cf6",
        bg: "#ede9fe",
        text: "#5b21b6",
      },
      completed: {
        icon: "🎉",
        label: "Completed",
        color: "#10b981",
        bg: "#d1fae5",
        text: "#065f46",
      },
    };
    return statuses[status] || statuses.approved;
  };

  const getTrashIcon = (type: string) => {
    const icons: Record<string, string> = {
      mixed: "🗑️",
      plastic: "♻️",
      glass: "🍾",
      metal: "🔧",
      organic: "🌿",
      hazardous: "⚠️",
    };
    return icons[type] || "📦";
  };

  const getStatusMessage = (report: Report) => {
    switch (report.status) {
      case "pending-review":
        return "Waiting for admin review...";
      case "approved":
        return "✅ Approved! Waiting for assignment...";
      case "assigned":
        return `👤 Assigned to ${report.assignedTo} - Waiting to start...`;
      case "in-progress":
        return `⚙️ ${report.assignedTo} is cleaning up now...`;
      case "completed":
        return report.pointsEarned
          ? `🎉 Completed! You earned ⭐ ${report.points} points!`
          : `✅ Completed on ${report.completedAt}`;
      default:
        return "Unknown status";
    }
  };

  return (
    <div className="page">
      <div className="reports-header">
        <h2>📍 My Trash Reports</h2>
        <p>Track your reports and earnings from cleanup contributions</p>
      </div>

      <div className="reports-controls">
        <div className="filter-group">
          <label htmlFor="status-filter">Filter by Status:</label>
          <select
            id="status-filter"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as any)}
            className="filter-select"
          >
            <option value="all">All Reports</option>
            <option value="pending-review">Pending Review</option>
            <option value="approved">Approved</option>
            <option value="assigned">Assigned</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
        </div>

        <div className="sort-group">
          <label htmlFor="sort-by">Sort by:</label>
          <select
            id="sort-by"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="sort-select"
          >
            <option value="recent">Most Recent</option>
            <option value="points">Highest Reward</option>
          </select>
        </div>
      </div>

      {sortedReports.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📭</div>
          <h3>No reports found</h3>
          <p>Start reporting trash locations to help clean our environment!</p>
        </div>
      ) : (
        <div className="reports-grid">
          {sortedReports.map((report) => {
            const statusInfo = getStatusInfo(report.status);
            return (
              <div
                key={report.id}
                className={`report-card ${report.status}`}
                onClick={() => navigate(`/report/${report.id}`)}
              >
                <div className="report-image-section">
                  <img src={report.picture} alt={report.title} />
                  <div className="report-badges">
                    <span
                      className="badge-status"
                      style={{
                        backgroundColor: statusInfo.bg,
                        color: statusInfo.text,
                      }}
                    >
                      {statusInfo.icon} {statusInfo.label}
                    </span>
                  </div>
                </div>

                <div className="report-content">
                  <div className="report-header">
                    <h3>{report.title}</h3>
                  </div>

                  <p className="report-description">{report.description.substring(0, 100)}...</p>

                  <div className="report-meta">
                    <span className="meta-item">
                      {getTrashIcon(report.trashType)} {report.trashType}
                    </span>
                    <span className="meta-item">📍 {report.latitude.toFixed(4)}, {report.longitude.toFixed(4)}</span>
                    <span className="meta-item">📅 {report.reportedAt}</span>
                  </div>

                  <div className="status-message">
                    {getStatusMessage(report)}
                  </div>

                  <div className="report-footer">
                    <span className="points-badge">
                      ⭐ {report.pointsEarned ? `+${report.points}` : report.points} points
                    </span>
                    <span className="report-link">View Details →</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
