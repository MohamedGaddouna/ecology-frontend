import "./ComplaintsList.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

interface Complaint {
  id: number;
  title: string;
  description: string;
  category: string;
  priority: string;
  status: "pending" | "in-review" | "resolved";
  createdAt: string;
  responses: number;
}

export default function ComplaintsList() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState("all");
  const [sortBy, setSortBy] = useState("recent");

  // Mock data
  const [complaints] = useState<Complaint[]>([
    {
      id: 1,
      title: "Application crashes on mobile",
      description:
        "The application crashes when trying to view task details on mobile devices...",
      category: "technical",
      priority: "high",
      status: "in-review",
      createdAt: "2025-12-14",
      responses: 2,
    },
    {
      id: 2,
      title: "Unclear task instructions",
      description: "Some tasks have vague descriptions that are hard to understand...",
      category: "task",
      priority: "medium",
      status: "pending",
      createdAt: "2025-12-13",
      responses: 0,
    },
    {
      id: 3,
      title: "Location accuracy issues",
      description: "GPS coordinates are not accurate in certain areas...",
      category: "general",
      priority: "medium",
      status: "resolved",
      createdAt: "2025-12-12",
      responses: 3,
    },
  ]);

  const filteredComplaints = complaints.filter((c) => {
    if (filter === "all") return true;
    return c.status === filter;
  });

  const sortedComplaints = [...filteredComplaints].sort((a, b) => {
    if (sortBy === "recent")
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    if (sortBy === "priority") {
      const priorityOrder = { urgent: 4, high: 3, medium: 2, low: 1 };
      return (
        priorityOrder[b.priority as keyof typeof priorityOrder] -
        priorityOrder[a.priority as keyof typeof priorityOrder]
      );
    }
    return 0;
  });

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent":
        return "priority-urgent";
      case "high":
        return "priority-high";
      case "medium":
        return "priority-medium";
      case "low":
        return "priority-low";
      default:
        return "";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "status-pending";
      case "in-review":
        return "status-in-review";
      case "resolved":
        return "status-resolved";
      default:
        return "";
    }
  };

  return (
    <div className="page">
      <div className="complaints-header">
        <div>
          <h2>📋 Complaints</h2>
          <p>Track and manage your submitted complaints</p>
        </div>
        <button
          className="btn-create"
          onClick={() => navigate("/complaints/create")}
        >
          ➕ New Complaint
        </button>
      </div>

      <div className="complaints-controls">
        <div className="filter-group">
          <label>Status:</label>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="in-review">In Review</option>
            <option value="resolved">Resolved</option>
          </select>
        </div>

        <div className="sort-group">
          <label>Sort by:</label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="sort-select"
          >
            <option value="recent">Most Recent</option>
            <option value="priority">Priority</option>
          </select>
        </div>
      </div>

      {sortedComplaints.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📝</div>
          <h3>No Complaints Yet</h3>
          <p>You haven't submitted any complaints. Click the button above to create one.</p>
        </div>
      ) : (
        <div className="complaints-list">
          {sortedComplaints.map((complaint) => (
            <div
              key={complaint.id}
              className="complaint-card"
              onClick={() => navigate(`/complaints/${complaint.id}`)}
            >
              <div className="complaint-header-row">
                <div className="complaint-title-section">
                  <h3>{complaint.title}</h3>
                  <p className="complaint-category">
                    {complaint.category.charAt(0).toUpperCase() +
                      complaint.category.slice(1)}
                  </p>
                </div>
                <div className="complaint-badges">
                  <span className={`badge priority ${getPriorityColor(complaint.priority)}`}>
                    {complaint.priority.toUpperCase()}
                  </span>
                  <span className={`badge status ${getStatusColor(complaint.status)}`}>
                    {complaint.status === "in-review"
                      ? "IN REVIEW"
                      : complaint.status.toUpperCase()}
                  </span>
                </div>
              </div>

              <p className="complaint-description">{complaint.description}</p>

              <div className="complaint-footer">
                <span className="complaint-date">
                  📅 {new Date(complaint.createdAt).toLocaleDateString()}
                </span>
                <span className="complaint-responses">
                  💬 {complaint.responses} {complaint.responses === 1 ? "response" : "responses"}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
