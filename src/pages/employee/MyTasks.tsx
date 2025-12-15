import "./MyTasks.css";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getUser } from "../../api/users";

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
  const [tasks, setTasks] = useState<CleanupTask[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const userId = localStorage.getItem("ecology_user_id");
        if (!userId) {
          setError("User not logged in");
          setLoading(false);
          return;
        }

        const response = await getUser(userId);
        if (response.data && response.data.userTasks) {
          // Map API response to CleanupTask interface
          const mappedTasks: CleanupTask[] = response.data.userTasks.map((ut: any) => {
            const task = ut.task;
            return {
              id: task.id.toString(),
              title: task.title,
              description: task.description,
              picture: task.picture ? `${process.env.REACT_APP_API_URL}${task.picture}` : "/trash.jpg",
              latitude: task.latitude || 0,
              longitude: task.longitude || 0,
              points: task.point || 0,
              trashType: task.category || "mixed",
              status: task.status ? "assigned" : "assigned", // Default to assigned as we don't have granular status yet
              reportedBy: "Unknown", // Backend doesn't provide this in the current include chain
              reportedAt: new Date(task.createdAt).toLocaleDateString(),
              assignedAt: new Date().toLocaleDateString(), // Placeholder
            };
          });
          setTasks(mappedTasks);
        }
      } catch (err) {
        console.error("Failed to fetch tasks", err);
        setError("Failed to load tasks");
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, []);

  const filteredTasks = tasks.filter((task) => {
    if (filterStatus === "all") return true;
    return task.status === filterStatus;
  });

  const sortedTasks = [...filteredTasks].sort((a, b) => {
    if (sortBy === "recent") {
      // Simple string comparison for now, ideally parse dates
      return b.id.localeCompare(a.id);
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
    return icons[type.toLowerCase()] || "📦";
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

  if (loading) return <div className="page loading">Loading tasks...</div>;
  if (error) return <div className="page error">{error}</div>;

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
                <img src={task.picture} alt={task.title} onError={(e) => (e.currentTarget.src = "/trash.jpg")} />
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
