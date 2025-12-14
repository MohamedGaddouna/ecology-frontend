import "./UserTasks.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

interface Task {
  id: string;
  title: string;
  description: string;
  picture: string;
  latitude: number;
  longitude: number;
  points: number;
  category: string;
  priority: "low" | "medium" | "high" | "urgent";
  approved: boolean;
  status: "pending" | "in-progress" | "completed";
  createdAt: string;
}

export default function UserTasks() {
  const navigate = useNavigate();
  const [filterStatus, setFilterStatus] = useState<"all" | "pending" | "in-progress" | "completed">("all");
  const [sortBy, setSortBy] = useState<"recent" | "points">("recent");

  // Mock data
  const mockTasks: Task[] = [
    {
      id: "1",
      title: "Trash pile near park entrance",
      description: "Large accumulation of mixed trash near the main entrance of Central Park. Includes plastic bags, bottles, and paper waste.",
      picture: "/trash.jpg",
      latitude: 40.785091,
      longitude: -73.968285,
      points: 150,
      category: "trash",
      priority: "high",
      approved: true,
      status: "in-progress",
      createdAt: "2025-12-12",
    },
    {
      id: "2",
      title: "Plastic waste behind mall",
      description: "Scattered plastic waste behind the shopping mall. Mostly takeout containers and shopping bags.",
      picture: "/trash.jpg",
      latitude: 40.758896,
      longitude: -73.985130,
      points: 100,
      category: "plastic",
      priority: "medium",
      approved: true,
      status: "completed",
      createdAt: "2025-12-10",
    },
    {
      id: "3",
      title: "Glass bottles on river bank",
      description: "Multiple broken glass bottles scattered along the river bank. Hazardous for pedestrians.",
      picture: "/trash.jpg",
      latitude: 40.788988,
      longitude: -73.968283,
      points: 200,
      category: "glass",
      priority: "urgent",
      approved: false,
      status: "pending",
      createdAt: "2025-12-13",
    },
  ];

  const filteredTasks = mockTasks.filter((task) => {
    if (filterStatus === "all") return true;
    return task.status === filterStatus;
  });

  const sortedTasks = [...filteredTasks].sort((a, b) => {
    if (sortBy === "recent") {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    } else {
      return b.points - a.points;
    }
  });

  const getPriorityColor = (priority: string) => {
    const colors: Record<string, string> = {
      low: "#d1fae5",
      medium: "#dbeafe",
      high: "#fef3c7",
      urgent: "#fee2e2",
    };
    return colors[priority] || "#f3f4f6";
  };

  const getPriorityTextColor = (priority: string) => {
    const colors: Record<string, string> = {
      low: "#065f46",
      medium: "#0c2d6b",
      high: "#92400e",
      urgent: "#991b1b",
    };
    return colors[priority] || "#6b7280";
  };

  const getStatusIcon = (status: string) => {
    const icons: Record<string, string> = {
      pending: "⏳",
      "in-progress": "⚙️",
      completed: "✅",
    };
    return icons[status] || "📋";
  };

  const getCategoryIcon = (category: string) => {
    const icons: Record<string, string> = {
      trash: "🗑️",
      plastic: "♻️",
      glass: "🍾",
      metal: "🔧",
      hazardous: "⚠️",
      other: "📦",
    };
    return icons[category] || "📦";
  };

  return (
    <div className="page">
      <div className="tasks-header">
        <h2>📋 My Tasks</h2>
        <p>View and manage all your reported tasks</p>
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
            <option value="pending">Pending Approval</option>
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
          <div className="empty-icon">📭</div>
          <h3>No tasks found</h3>
          <p>Create a new task to get started!</p>
        </div>
      ) : (
        <div className="tasks-grid">
          {sortedTasks.map((task) => (
            <div
              key={task.id}
              className={`task-card ${task.status}`}
              onClick={() => navigate(`/task/${task.id}`)}
            >
              <div className="task-image-section">
                <img src={task.picture} alt={task.title} />
                <div className="task-badges">
                  {!task.approved && <span className="badge-unapproved">Pending Review</span>}
                  <span
                    className="badge-priority"
                    style={{
                      backgroundColor: getPriorityColor(task.priority),
                      color: getPriorityTextColor(task.priority),
                    }}
                  >
                    {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                  </span>
                </div>
              </div>

              <div className="task-content">
                <div className="task-header">
                  <h3>{task.title}</h3>
                  <span className="status-badge">{getStatusIcon(task.status)} {task.status.replace("-", " ")}</span>
                </div>

                <p className="task-description">{task.description.substring(0, 100)}...</p>

                <div className="task-meta">
                  <span className="meta-item">
                    {getCategoryIcon(task.category)} {task.category}
                  </span>
                  <span className="meta-item">📍 {task.latitude.toFixed(4)}, {task.longitude.toFixed(4)}</span>
                  <span className="meta-item">📅 {task.createdAt}</span>
                </div>

                <div className="task-footer">
                  <span className="points-badge">⭐ {task.points} points</span>
                  <span className="task-link">View Details →</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
