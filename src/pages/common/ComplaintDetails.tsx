import "./ComplaintDetails.css";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function ComplaintDetails() {
  // const { id } = useParams();
  const navigate = useNavigate();
  const [replyText, setReplyText] = useState("");

  // Mock data
  const complaint = {
    id: 1,
    title: "Application crashes on mobile",
    description:
      "The application crashes when trying to view task details on mobile devices. This happens consistently on iOS devices when the task description is longer than 500 characters.",
    category: "technical",
    priority: "high",
    status: "in-review",
    createdAt: "2025-12-14T10:30:00",
    submittedBy: "John Doe",
    responses: [
      {
        id: 1,
        author: "Support Team",
        role: "ADMIN",
        content:
          "Thank you for reporting this issue. We have identified the problem and are working on a fix. It will be included in the next release.",
        createdAt: "2025-12-14T14:20:00",
      },
      {
        id: 2,
        author: "Developer",
        role: "ADMIN",
        content:
          "We've pushed a temporary workaround to production. Please try again and let us know if the issue persists.",
        createdAt: "2025-12-14T16:45:00",
      },
    ],
  };

  const handleReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (replyText.trim()) {
      setReplyText("");
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return { text: "PENDING", color: "pending" };
      case "in-review":
        return { text: "IN REVIEW", color: "in-review" };
      case "resolved":
        return { text: "RESOLVED", color: "resolved" };
      default:
        return { text: status, color: "" };
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "urgent":
        return { text: "🔴 URGENT", color: "urgent" };
      case "high":
        return { text: "🟠 HIGH", color: "high" };
      case "medium":
        return { text: "🟡 MEDIUM", color: "medium" };
      case "low":
        return { text: "🟢 LOW", color: "low" };
      default:
        return { text: priority, color: "" };
    }
  };

  const statusBadge = getStatusBadge(complaint.status);
  const priorityBadge = getPriorityBadge(complaint.priority);

  return (
    <div className="page">
      <button className="back-btn" onClick={() => navigate("/complaints")}>
        ← Back to Complaints
      </button>

      <div className="complaint-details-container">
        <div className="complaint-main">
          <div className="complaint-header-section">
            <div>
              <h1>{complaint.title}</h1>
              <p className="complaint-meta">
                Submitted by {complaint.submittedBy} on{" "}
                {new Date(complaint.createdAt).toLocaleDateString()}
              </p>
            </div>
            <div className="status-badges">
              <span className={`status-badge ${statusBadge.color}`}>
                {statusBadge.text}
              </span>
              <span className={`priority-badge ${priorityBadge.color}`}>
                {priorityBadge.text}
              </span>
            </div>
          </div>

          <div className="complaint-info">
            <div className="info-item">
              <span className="info-label">Category:</span>
              <span className="info-value">
                {complaint.category.charAt(0).toUpperCase() +
                  complaint.category.slice(1)}
              </span>
            </div>
            <div className="info-item">
              <span className="info-label">Priority:</span>
              <span className="info-value">
                {complaint.priority.charAt(0).toUpperCase() +
                  complaint.priority.slice(1)}
              </span>
            </div>
            <div className="info-item">
              <span className="info-label">Status:</span>
              <span className={`info-value status-${complaint.status}`}>
                {complaint.status === "in-review" ? "In Review" : complaint.status}
              </span>
            </div>
          </div>

          <div className="complaint-description-section">
            <h2>📝 Description</h2>
            <div className="description-box">
              <p>{complaint.description}</p>
            </div>
          </div>

          <div className="responses-section">
            <h2>💬 Responses ({complaint.responses.length})</h2>

            {complaint.responses.length === 0 ? (
              <div className="no-responses">
                <p>No responses yet. The support team will review your complaint soon.</p>
              </div>
            ) : (
              <div className="responses-list">
                {complaint.responses.map((response) => (
                  <div key={response.id} className="response-item">
                    <div className="response-header">
                      <div>
                        <strong>{response.author}</strong>
                        <span className="role-badge">{response.role}</span>
                      </div>
                      <span className="response-date">
                        {new Date(response.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="response-content">{response.content}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {complaint.status !== "resolved" && (
            <div className="reply-section">
              <h2>✍️ Add Reply</h2>
              <form onSubmit={handleReply} className="reply-form">
                <textarea
                  placeholder="Type your reply here..."
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  rows={4}
                />
                <div className="reply-actions">
                  <button
                    type="submit"
                    className="btn-primary"
                    disabled={!replyText.trim()}
                  >
                    Send Reply
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>

        <div className="complaint-sidebar">
          <div className="sidebar-card">
            <h3>📊 Complaint Statistics</h3>
            <div className="stat-item">
              <span>Status:</span>
              <strong>{complaint.status}</strong>
            </div>
            <div className="stat-item">
              <span>Priority:</span>
              <strong>{complaint.priority}</strong>
            </div>
            <div className="stat-item">
              <span>Total Responses:</span>
              <strong>{complaint.responses.length}</strong>
            </div>
            <div className="stat-item">
              <span>Days Open:</span>
              <strong>
                {Math.floor(
                  (new Date().getTime() -
                    new Date(complaint.createdAt).getTime()) /
                  (1000 * 60 * 60 * 24)
                )}
              </strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
