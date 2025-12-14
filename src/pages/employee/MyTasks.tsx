import "./MyTasks.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

interface CleanupTask {
  id: string;
  title: string;
  description: string;
  picture: string;
  latitude: number;
  longitude: number;
  points: number;
  trashType: string;
  status: "assigned" | "in-progress" | "completed";
  reportedBy: string;
  reportedAt: string;
  assignedAt: string;
  completedAt?: string;
}

export default function MyTasks() {
  const navigate = useNavigate();
  const [filterStatus, setFilterStatus] = useState<"all" | "assigned" | "in-progress" | "completed">("all");
  const [sortBy, setSortBy] = useState<"recent" | "points">("recent");

  // Mock cleanup tasks assigned to this employee
  const mockTasks: CleanupTask[] = [
    {
      id: "1",
      title: "Trash pile near park entrance",
      description: "Large accumulation of mixed trash including plastic bags, bottles, and paper waste scattered near the main entrance.",
      picture: "/trash.jpg",
      latitude: 40.785091,
      longitude: -73.968285,
      points: 150,
      trashType: "mixed",
      status: "in-progress",
      reportedBy: "John Doe",
      reportedAt: "2025-12-10",
      assignedAt: "2025-12-11",
    },
    {
      id: "2",
      title: "Plastic waste behind mall",
      description: "Scattered plastic waste and takeout containers. Mostly shopping bags and food packaging.",
      picture: "/trash.jpg",
      latitude: 40.758896,
      longitude: -73.985130,
      points: 100,
      trashType: "plastic",
      status: "assigned",
      reportedBy: "Sarah Smith",
      reportedAt: "2025-12-08",
      assignedAt: "2025-12-12",
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
      status: "completed",
      reportedBy: "Mike Johnson",
      reportedAt: "2025-12-09",
      assignedAt: "2025-12-09",
      completedAt: "2025-12-13",
    },
  ];

  const filteredTasks = mockTasks.filter((task) => {
    if (filterStatus === "all") return true;
    return task.status === filterStatus;
  });

  const sortedTasks = [...filteredTasks].sort((a, b) => {
    if (sortBy === "recent") {
      return new Date(b.assignedAt).getTime() - new Date(a.assignedAt).getTime();
    } else {
      return b.points - a.points;
    }
  });

  const getStatusIcon = (status: string) => {
    const icons: Record<string, string> = {
      assigned: "👤",
      "in-progress": "⚙️",
      completed: "✅",
    };
    return icons[status] || "📋";
  };

  const getTrashIcon = (type: string) => {
    const icons: Record<string, string> = {
      mixed: "🗑️",
      plastic: "♻️",
      glass: "🍾",
      metal: "🔧",
      hazardous: "⚠️",
    };
    return icons[type] || "📦";
  };

  const getStatusMessage = (status: string) => {
    switch (status) {
      case "assigned":
        return "👤 Assigned to you - Ready to start";
      case "in-progress":
        return "⚙️ You're cleaning this up now...";
      case "completed":
        return "✅ Completed";
      default:
        return "Unknown status";
    }
  };

  return (
    <div className="page">
      <div className="tasks-header">
        <h2>🧹 Cleanup Tasks</h2>
        <p>Complete your assigned trash cleanup tasks to help keep our environment clean</p>
      </div>

      <div className="tasks-controls">
        <div className="filter-group">
          <label htmlFor="status-filter">Filter by Status:</label>
          <select
            id="status-filter"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as any)}
            className="filter-select"
          >
            <option value="all">All Tasks</option>
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
            <option value="points">Highest Points</option>
          </select>
        </div>
      </div>

      {sortedTasks.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">✅</div>
          <h3>All caught up!</h3>
          <p>You've completed all your assigned cleanup tasks. Great work!</p>
        </div>
      ) : (
        <div className="tasks-grid">
          {sortedTasks.map((task) => (
            <div
              key={task.id}
              className={`task-card ${task.status}`}
              onClick={() => navigate(`/cleanup/${task.id}`)}
            >
              <div className="task-image-section">
                <img src={task.picture} alt={task.title} />
                <div className="task-badges">
                  <span className="badge-status">
                    {getStatusIcon(task.status)} {task.status.replace("-", " ")}
                  </span>
                </div>
              </div>

              <div className="task-content">
                <div className="task-header">
                  <h3>{task.title}</h3>
                </div>

                <p className="task-description">{task.description.substring(0, 100)}...</p>

                {/* Reporter Info - Key differentiator */}
                <div className="reporter-info">
                  <span className="reporter-label">📢 Reported by</span>
                  <span className="reporter-name">{task.reportedBy}</span>
                </div>

                <div className="task-meta">
                  <span className="meta-item">
                    {getTrashIcon(task.trashType)} {task.trashType}
                  </span>
                  <span className="meta-item">📍 {task.latitude.toFixed(4)}, {task.longitude.toFixed(4)}</span>
                  <span className="meta-item">📅 {task.reportedAt}</span>
                </div>

                <div className="status-message">
                  {getStatusMessage(task.status)}
                </div>

                <div className="task-footer">
                  <span className="points-info">
                    ⭐ Reporter earns {task.points} points
                  </span>
                  <span className="task-link">View Details →</span>
                </div>

                {task.status === "assigned" && (
                  <button className="btn-start">⚙️ Start Cleanup</button>
                )}
                {task.status === "in-progress" && (
                  <button className="btn-complete">✅ Mark Complete</button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
