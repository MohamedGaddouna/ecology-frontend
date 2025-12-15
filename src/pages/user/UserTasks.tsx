import "./UserTasks.css";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getUser } from "../../api/users";

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
}

interface UserTask {
  userId: number;
  taskId: number;
  task: Task;
}

export default function UserTasks() {
  const navigate = useNavigate();
  const [filterStatus, setFilterStatus] = useState<"all" | "pending" | "approved" | "rejected">("all");
  const [sortBy, setSortBy] = useState<"recent" | "points">("recent");
  const [userTasks, setUserTasks] = useState<UserTask[]>([]);
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
          setUserTasks(response.data.userTasks);
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

  const getTaskStatus = (task: Task) => {
    if (task.status === "approved") return "approved";
    if (task.status === "rejected") return "rejected";
    return "pending";
  };

  const filteredTasks = userTasks.filter((ut) => {
    const status = getTaskStatus(ut.task);
    if (filterStatus === "all") return true;
    return status === filterStatus;
  });

  const sortedTasks = [...filteredTasks].sort((a, b) => {
    if (sortBy === "recent") {
      return new Date(b.task.createdAt).getTime() - new Date(a.task.createdAt).getTime();
    } else {
      return (b.task.point || 0) - (a.task.point || 0);
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
      approved: "✅",
      rejected: "❌",
    };
    return icons[status] || "📋";
  };

  const parseDescription = (desc: string) => {
    const parts = desc.split(": ");
    if (parts.length > 1) {
      return { title: parts[0], description: parts.slice(1).join(": ") };
    }
    return { title: "Task", description: desc };
  };

  if (loading) return <div className="page loading">Loading tasks...</div>;
  if (error) return <div className="page error">{error}</div>;

  return (
    <div className="page">
      <div className="tasks-header">
        <h2>📋 My Assigned Tasks</h2>
        <p>View and manage tasks assigned to you</p>
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
            <option value="approved">Approved</option>
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
          <h3>No assigned tasks</h3>
          <p>You have no tasks assigned yet.</p>
        </div>
      ) : (
        <div className="tasks-grid">
          {sortedTasks.map((ut) => {
            const task = ut.task;
            const { title, description, category, priority } = task;
            const trashType = category || "mixed";
            const status = getTaskStatus(task);
            const pictureUrl = task.picture ? `${process.env.REACT_APP_API_URL}${task.picture}` : "/trash.jpg";

            return (
              <div
                key={task.id}
                className={`task-card ${status}`}
                onClick={() => navigate(`/task/${task.id}`)}
              >
                <div className="task-image-section">
                  <img src={pictureUrl} alt={title} onError={(e) => (e.currentTarget.src = "/trash.jpg")} />
                  <div className="task-badges">
                    {task.status === "pending" && <span className="badge-unapproved">Pending Review</span>}
                    <span
                      className="badge-priority"
                      style={{
                        backgroundColor: getPriorityColor(priority || "medium"),
                        color: getPriorityTextColor(priority || "medium"),
                      }}
                    >
                      {priority || "Medium"}
                    </span>
                  </div>
                </div>

                <div className="task-content">
                  <div className="task-header">
                    <h3>{title}</h3>
                    <span className="status-badge">{getStatusIcon(status)} {status}</span>
                  </div>

                  <p className="task-description">{description.substring(0, 100)}...</p>

                  <div className="task-meta">
                    <span className="meta-item">
                      📦 Trash
                    </span>
                    <span className="meta-item">📍 {task.latitude?.toFixed(4)}, {task.longitude?.toFixed(4)}</span>
                    <span className="meta-item">📅 {new Date(task.createdAt).toLocaleDateString()}</span>
                  </div>

                  <div className="task-footer">
                    <span className="points-badge">⭐ {task.point} points</span>
                    <span className="task-link">View Details →</span>
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
