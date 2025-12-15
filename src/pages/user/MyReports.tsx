import "./MyReports.css";
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
  approved: string;
  createdAt: string;
}

export default function MyReports() {
  const navigate = useNavigate();
  const [filterStatus, setFilterStatus] = useState<"all" | "pending" | "approved" | "rejected">("all");
  const [sortBy, setSortBy] = useState<"recent" | "points">("recent");
  const [reports, setReports] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const userId = localStorage.getItem("ecology_user_id");
        if (!userId) {
          setError("User not logged in");
          setLoading(false);
          return;
        }
        const response = await getUser(userId);
        if (response.data && response.data.createdTasks) {
          setReports(response.data.createdTasks);
        }
      } catch (err) {
        console.error("Failed to fetch reports", err);
        setError("Failed to load reports");
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

  const getReportStatus = (report: Task) => {
    if (report.approved === "accepted") return "approved";
    if (report.approved === "rejected") return "rejected";
    return "pending";
  };

  const filteredReports = reports.filter((report) => {
    const status = getReportStatus(report);
    if (filterStatus === "all") return true;
    return status === filterStatus;
  });

  const sortedReports = [...filteredReports].sort((a, b) => {
    if (sortBy === "recent") {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    } else {
      return (b.point || 0) - (a.point || 0);
    }
  });

  const getStatusInfo = (status: string) => {
    const statuses: Record<string, { icon: string; label: string; color: string; bg: string; text: string }> = {
      pending: {
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
      rejected: {
        icon: "❌",
        label: "Rejected",
        color: "#ef4444",
        bg: "#fee2e2",
        text: "#991b1b",
      },
    };
    return statuses[status] || statuses.pending;
  };

  if (loading) return <div className="page loading">Loading reports...</div>;
  if (error) return <div className="page error">{error}</div>;

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
            <option value="pending">Pending Review</option>
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
            const status = getReportStatus(report);
            const statusInfo = getStatusInfo(status);
            const { title, description, category } = report;
            const pictureUrl = report.picture ? `${process.env.REACT_APP_API_URL}${report.picture}` : "/trash.jpg";

            return (
              <div
                key={report.id}
                className={`report-card ${status}`}
                onClick={() => navigate(`/task/${report.id}`)}
              >
                <div className="report-image-section">
                  <img src={pictureUrl} alt={title} onError={(e) => (e.currentTarget.src = "/trash.jpg")} />
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
                    <h3>{title}</h3>
                  </div>

                  <p className="report-description">{description.substring(0, 100)}...</p>

                  <div className="report-meta">
                    <span className="meta-item">
                      📦 Trash
                    </span>
                    <span className="meta-item">📍 {report.latitude?.toFixed(4)}, {report.longitude?.toFixed(4)}</span>
                    <span className="meta-item">📅 {new Date(report.createdAt).toLocaleDateString()}</span>
                  </div>

                  <div className="report-footer">
                    <span className="points-badge">
                      ⭐ {report.point} points
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
