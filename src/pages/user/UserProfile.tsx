import "./UserProfile.css";
import { useState } from "react";

interface UserData {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: "USER" | "EMPLOYEE" | "ADMIN";
  totalPoints: number;
  joinedDate: string;
  profilePicture: string;
  bio: string;
}

interface Statistics {
  totalTasks: number;
  completedTasks: number;
  inProgressTasks: number;
  totalComplaints: number;
  resolvedComplaints: number;
  totalPoints: number;
  longestStreak: number;
}

interface RecentActivity {
  id: string;
  type: "task" | "complaint" | "achievement";
  title: string;
  description: string;
  date: string;
}

export default function UserProfile() {
  const [editMode, setEditMode] = useState(false);

  // Mock user data
  const userData: UserData = {
    id: "user-123",
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@email.com",
    role: "USER",
    totalPoints: 450,
    joinedDate: "2025-01-15",
    profilePicture: "/profile.jpg",
    bio: "Passionate about environmental conservation and cleaning up our community.",
  };

  // Mock statistics
  const statistics: Statistics = {
    totalTasks: 24,
    completedTasks: 18,
    inProgressTasks: 3,
    totalComplaints: 5,
    resolvedComplaints: 4,
    totalPoints: 450,
    longestStreak: 12,
  };

  // Mock recent activity
  const recentActivity: RecentActivity[] = [
    {
      id: "1",
      type: "task",
      title: "Completed trash cleanup at Central Park",
      description: "Earned 150 points for completing a high-priority task",
      date: "2025-12-10",
    },
    {
      id: "2",
      type: "complaint",
      title: "Complaint resolved",
      description: "Your report about plastic waste was reviewed and addressed",
      date: "2025-12-08",
    },
    {
      id: "3",
      type: "achievement",
      title: "🏆 Milestone Achieved",
      description: "Reached 400 points! Keep up the great work!",
      date: "2025-12-05",
    },
    {
      id: "4",
      type: "task",
      title: "Created new cleanup task",
      description: "Posted task for glass waste near shopping mall",
      date: "2025-12-01",
    },
  ];

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
              <img src={userData.profilePicture} alt="Profile" />
            </div>

            <div className="profile-basic-info">
              <h1>
                {userData.firstName} {userData.lastName}
              </h1>
              <p className="profile-role" style={{ color: getRoleColor(userData.role) }}>
                {userData.role}
              </p>
              <p className="profile-email">{userData.email}</p>
              <p className="profile-joined">
                Joined on {new Date(userData.joinedDate).toLocaleDateString()}
              </p>

              {editMode ? (
                <div className="bio-edit">
                  <textarea defaultValue={userData.bio} placeholder="Add your bio..." rows={3} />
                  <div className="bio-buttons">
                    <button className="btn-save">Save Bio</button>
                    <button className="btn-cancel" onClick={() => setEditMode(false)}>
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <p className="profile-bio">{userData.bio}</p>
                  <button className="btn-edit" onClick={() => setEditMode(true)}>
                    ✏️ Edit Profile
                  </button>
                </>
              )}
            </div>

            <div className="profile-quick-stats">
              <div className="quick-stat">
                <span className="stat-value">⭐ {statistics.totalPoints}</span>
                <span className="stat-label">Total Points</span>
              </div>
              <div className="quick-stat">
                <span className="stat-value">🔥 {statistics.longestStreak}</span>
                <span className="stat-label">Day Streak</span>
              </div>
              <div className="quick-stat">
                <span className="stat-value">✅ {statistics.completedTasks}</span>
                <span className="stat-label">Completed</span>
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
              <h3>Tasks</h3>
              <div className="stat-main-value">{statistics.totalTasks}</div>
              <div className="stat-details">
                <div className="detail-row">
                  <span>Completed</span>
                  <strong>{statistics.completedTasks}</strong>
                </div>
                <div className="detail-row">
                  <span>In Progress</span>
                  <strong>{statistics.inProgressTasks}</strong>
                </div>
              </div>
              <div className="stat-progress">
                <div
                  className="progress-bar"
                  style={{
                    width: `${(statistics.completedTasks / statistics.totalTasks) * 100}%`,
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
                  <span>Resolved</span>
                  <strong>{statistics.resolvedComplaints}</strong>
                </div>
                <div className="detail-row">
                  <span>Pending</span>
                  <strong>
                    {statistics.totalComplaints - statistics.resolvedComplaints}
                  </strong>
                </div>
              </div>
              <div className="stat-progress">
                <div
                  className="progress-bar resolved"
                  style={{
                    width: `${(statistics.resolvedComplaints / statistics.totalComplaints) * 100 || 0}%`,
                  }}
                ></div>
              </div>
            </div>

            {/* Points Card */}
            <div className="stat-card">
              <h3>Points</h3>
              <div className="stat-main-value">{statistics.totalPoints}</div>
              <div className="stat-details">
                <div className="detail-row">
                  <span>Rank</span>
                  <strong>#42</strong>
                </div>
                <div className="detail-row">
                  <span>Level</span>
                  <strong>Gold ⭐</strong>
                </div>
              </div>
              <div className="stat-progress">
                <div
                  className="progress-bar points"
                  style={{
                    width: `${Math.min((statistics.totalPoints / 1000) * 100, 100)}%`,
                  }}
                ></div>
              </div>
            </div>

            {/* Achievement Card */}
            <div className="stat-card">
              <h3>Achievements</h3>
              <div className="stat-main-value">6</div>
              <div className="stat-details">
                <div className="detail-row">
                  <span>Badges</span>
                  <strong>🏆🌟💚</strong>
                </div>
                <div className="detail-row">
                  <span>Unlocked</span>
                  <strong>6 of 12</strong>
                </div>
              </div>
              <div className="stat-progress">
                <div className="progress-bar achievement" style={{ width: "50%" }}></div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity Section */}
        <div className="activity-section">
          <h2>📅 Recent Activity</h2>

          <div className="activity-timeline">
            {recentActivity.map((activity, index) => (
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
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
