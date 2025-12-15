import "./UserProfile.css";
import { useState, useEffect } from "react";
import { getUser } from "../../api/users";

interface Task {
  id: number;
  title: string;
  description: string;
  point: number | null;
  status: string;
  createdAt: string;
  picture: string | null;
}

interface UserTask {
  userId: number;
  taskId: number;
  task: Task;
}

interface Complain {
  id: number;
  description: string;
  createdAt?: string; // Assuming it might have this
}

interface UserData {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  points: number;
  complains: Complain[];
  createdTasks: Task[];
  userTasks: UserTask[];
}

interface Statistics {
  totalCreatedTasks: number;
  approvedTasks: number;
  pendingTasks: number;
  totalComplaints: number;
  totalPoints: number;
}

interface RecentActivity {
  id: string;
  type: "task" | "complaint" | "achievement";
  title: string;
  description: string;
  date: string;
}

export default function UserProfile() {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userId = localStorage.getItem("ecology_user_id");
        if (!userId) {
          setError("User not logged in");
          setLoading(false);
          return;
        }

        const response = await getUser(userId);
        setUserData(response.data);
      } catch (err) {
        console.error("Failed to fetch user data", err);
        setError("Failed to load profile");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  if (loading) return <div className="page loading">Loading profile...</div>;
  if (error) return <div className="page error">{error}</div>;
  if (!userData) return <div className="page error">User not found</div>;

  // Calculate statistics based on CREATED tasks (tasks the user reported)
  const totalCreatedTasks = userData.createdTasks.length;
  const approvedTasks = userData.createdTasks.filter(t => t.status === "approved").length;
  const pendingTasks = userData.createdTasks.filter(t => t.status === "pending").length;
  const totalComplaints = userData.complains.length;
  const totalPoints = userData.points; // From DB, awarded when tasks are approved

  const statistics: Statistics = {
    totalCreatedTasks,
    approvedTasks,
    pendingTasks,
    totalComplaints,
    totalPoints,
  };

  // Generate recent activity from tasks and complains
  const recentActivity: RecentActivity[] = [
    ...userData.userTasks.map((ut) => ({
      id: `task-${ut.taskId}`,
      type: "task" as const,
      title: "Task Assigned",
      description: ut.task.description,
      date: new Date(ut.task.createdAt).toLocaleDateString(),
    })),
    ...userData.createdTasks.map((t) => ({
      id: `created-${t.id}`,
      type: "task" as const,
      title: "Task Created",
      description: t.description,
      date: new Date(t.createdAt).toLocaleDateString(),
    })),
    ...userData.complains.map((c) => ({
      id: `complain-${c.id}`,
      type: "complaint" as const,
      title: "Complaint Filed",
      description: c.description,
      date: "Recent", // Date not in Complain model shown earlier
    })),
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 5);

  const getRoleColor = (role: string) => {
    const colors: Record<string, string> = {
      USER: "#10b981",
      EMPLOYEE: "#3b82f6",
      ADMIN: "#ef4444",
    };
    return colors[role] || "#6b7280";
  };

  const getActivityIcon = (type: string) => {
    const icons: Record<string, string> = {
      task: "✅",
      complaint: "📝",
      achievement: "🏆",
    };
    return icons[type] || "📌";
  };

  return (
    <div className="page">
      <div className="profile-container">
        {/* Profile Header */}
        <div className="profile-header">
          <div className="profile-cover"></div>

          <div className="profile-info-section">
            <div className="profile-avatar">
              <img src="/profile.jpg" alt="Profile" />
            </div>

            <div className="profile-basic-info">
              <h1>
                {userData.firstName} {userData.lastName}
              </h1>
              <p className="profile-role" style={{ color: getRoleColor(userData.role) }}>
                {userData.role}
              </p>
              <p className="profile-email">{userData.email}</p>
            </div>

            <div className="profile-quick-stats">
              <div className="quick-stat">
                <span className="stat-value">⭐ {statistics.totalPoints}</span>
                <span className="stat-label">Total Points</span>
              </div>
              <div className="quick-stat">
                <span className="stat-value">✅ {statistics.approvedTasks}</span>
                <span className="stat-label">Approved Tasks</span>
              </div>
            </div>
          </div>
        </div>

        {/* Statistics Section */}
        <div className="statistics-section">
          <h2>📊 Your Statistics</h2>

          <div className="stats-grid">
            {/* Tasks Card */}
            <div className="stat-card">
              <h3>Reported Tasks</h3>
              <div className="stat-main-value">{statistics.totalCreatedTasks}</div>
              <div className="stat-details">
                <div className="detail-row">
                  <span>Approved</span>
                  <strong>{statistics.approvedTasks}</strong>
                </div>
                <div className="detail-row">
                  <span>Pending</span>
                  <strong>{statistics.pendingTasks}</strong>
                </div>
              </div>
              <div className="stat-progress">
                <div
                  className="progress-bar"
                  style={{
                    width: `${(statistics.approvedTasks / statistics.totalCreatedTasks) * 100 || 0}%`,
                  }}
                ></div>
              </div>
            </div>

            {/* Complaints Card */}
            <div className="stat-card">
              <h3>Complaints</h3>
              <div className="stat-main-value">{statistics.totalComplaints}</div>
              <div className="stat-details">
                <div className="detail-row">
                  <span>Total Filed</span>
                  <strong>{statistics.totalComplaints}</strong>
                </div>
              </div>
            </div>

            {/* Points Card */}
            <div className="stat-card">
              <h3>Points</h3>
              <div className="stat-main-value">{statistics.totalPoints}</div>
              <div className="stat-details">
                <div className="detail-row">
                  <span>Total Earned</span>
                  <strong>{statistics.totalPoints}</strong>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity Section */}
      <div className="activity-section">
        <h2>📅 Recent Activity</h2>

        <div className="activity-timeline">
          {recentActivity.length === 0 ? (
            <p>No recent activity.</p>
          ) : (
            recentActivity.map((activity, index) => (
              <div key={activity.id} className="activity-item">
                <div className="activity-marker"></div>
                {index !== recentActivity.length - 1 && <div className="activity-line"></div>}

                <div className="activity-content">
                  <div className="activity-header">
                    <span className="activity-icon">{getActivityIcon(activity.type)}</span>
                    <h4>{activity.title}</h4>
                    <span className="activity-date">{activity.date}</span>
                  </div>
                  <p className="activity-description">{activity.description}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
