import "./ComplaintsList.css";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getComplains } from "../../api/complains";

interface User {
  id: number;
  firstName: string;
  lastName: string;
}

interface Complaint {
  id: number;
  title: string;
  description: string;
  createdAt?: string;
  user?: User;
}

export default function ComplaintsList() {
  const navigate = useNavigate();
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        const response = await getComplains();
        setComplaints(response.data);
      } catch (err) {
        console.error("Failed to fetch complaints", err);
        setError("Failed to load complaints");
      } finally {
        setLoading(false);
      }
    };

    fetchComplaints();
  }, []);

  if (loading) return <div className="page loading">Loading complaints...</div>;
  if (error) return <div className="page error">{error}</div>;

  return (
    <div className="page">
      <div className="complaints-header">
        <div>
          <h2>📋 Complaints</h2>
          <p>Track and manage submitted complaints</p>
        </div>
        <button
          className="btn-create"
          onClick={() => navigate("/complaints/create")}
        >
          ➕ New Complaint
        </button>
      </div>

      {complaints.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📝</div>
          <h3>No Complaints Yet</h3>
          <p>There are no complaints to display.</p>
        </div>
      ) : (
        <div className="complaints-list">
          {complaints.map((complaint) => (
            <div
              key={complaint.id}
              className="complaint-card"
              onClick={() => navigate(`/complaints/${complaint.id}`)}
            >
              <div className="complaint-header-row">
                <div className="complaint-title-section">
                  <h3>{complaint.title}</h3>
                  <p className="complaint-author">
                    By: {complaint.user ? `${complaint.user.firstName} ${complaint.user.lastName}` : "Unknown User"}
                  </p>
                </div>
              </div>

              <p className="complaint-description">{complaint.description}</p>

              <div className="complaint-footer">
                <span className="complaint-date">
                  📅 {complaint.createdAt ? new Date(complaint.createdAt).toLocaleDateString() : "Date not available"}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
