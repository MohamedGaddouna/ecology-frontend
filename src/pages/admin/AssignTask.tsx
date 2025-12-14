import "./AssignTask.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

interface TrashReport {
  id: string;
  title: string;
  description: string;
  picture: string;
  trashType: string;
  status: "pending-review" | "approved" | "assigned";
  reportedBy: string;
  reportedAt: string;
  points: number;
}

interface Employee {
  id: string;
  name: string;
  tasksCompleted: number;
  rating: number;
}

export default function AssignTask() {
  const navigate = useNavigate();
  const [selectedReport, setSelectedReport] = useState<string | null>(null);
  const [selectedEmployee, setSelectedEmployee] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState("pending-review");
  const [isAssigning, setIsAssigning] = useState(false);

  // Mock data
  const mockReports: TrashReport[] = [
    {
      id: "1",
      title: "Trash pile near park entrance",
      description: "Large accumulation of mixed trash near the main entrance",
      picture: "/trash.jpg",
      trashType: "mixed",
      status: "pending-review",
      reportedBy: "John Doe",
      reportedAt: "2025-12-12",
      points: 150,
    },
    {
      id: "2",
      title: "Plastic bottles at riverside",
      description: "Many plastic bottles scattered along the riverside path",
      picture: "/trash.jpg",
      trashType: "plastic",
      status: "pending-review",
      reportedBy: "Jane Smith",
      reportedAt: "2025-12-13",
      points: 100,
    },
    {
      id: "3",
      title: "Glass debris in parking lot",
      description: "Broken glass pieces in the shopping mall parking area",
      picture: "/trash.jpg",
      trashType: "glass",
      status: "approved",
      reportedBy: "Mike Johnson",
      reportedAt: "2025-12-11",
      points: 120,
    },
  ];

  const mockEmployees: Employee[] = [
    { id: "e1", name: "Sarah Johnson", tasksCompleted: 45, rating: 4.8 },
    { id: "e2", name: "Mike Williams", tasksCompleted: 38, rating: 4.6 },
    { id: "e3", name: "Elena Rodriguez", tasksCompleted: 52, rating: 4.9 },
    { id: "e4", name: "David Park", tasksCompleted: 31, rating: 4.7 },
  ];

  const filteredReports = mockReports.filter((r) => r.status === filterStatus);
  const selectedReportData = mockReports.find((r) => r.id === selectedReport);

  const handleApprove = () => {
    if (!selectedReport) {
      alert("Please select a report to approve");
      return;
    }
    alert("Report approved! It's now available for assignment.");
    setSelectedReport(null);
  };

  const handleReject = () => {
    if (!selectedReport) {
      alert("Please select a report to reject");
      return;
    }
    alert("Report rejected. The reporter will be notified.");
    setSelectedReport(null);
  };

  const handleAssign = () => {
    if (!selectedReport || !selectedEmployee) {
      alert("Please select both a report and an employee");
      return;
    }
    setIsAssigning(true);
    setTimeout(() => {
      const employee = mockEmployees.find((e) => e.id === selectedEmployee);
      alert(`Report assigned to ${employee?.name}! Cleanup can begin now.`);
      setSelectedReport(null);
      setSelectedEmployee(null);
      setIsAssigning(false);
    }, 1500);
  };

  const getTrashTypeIcon = (type: string) => {
    const icons: Record<string, string> = {
      plastic: "♻️",
      glass: "🍾",
      metal: "🔧",
      organic: "🌱",
      hazardous: "⚠️",
      mixed: "🗑️",
    };
    return icons[type] || "📦";
  };

  return (
    <div className="page">
      <div className="approval-header">
        <h2>📝 Review Trash Reports</h2>
        <p>Approve reports and assign cleanup tasks to volunteers</p>
      </div>

      <div className="approval-container">
        {/* Reports List */}
        <div className="reports-section">
          <div className="section-header">
            <h3>📋 Reports Queue</h3>
            <select
              value={filterStatus}
              onChange={(e) => {
                setFilterStatus(e.target.value as any);
                setSelectedReport(null);
              }}
              className="filter-select"
            >
              <option value="pending-review">⏳ Pending Review</option>
              <option value="approved">✅ Approved</option>
              <option value="assigned">👤 Assigned</option>
            </select>
          </div>

          {filteredReports.length === 0 ? (
            <div className="empty-state">
              <p>No reports to review in this status</p>
            </div>
          ) : (
            <div className="reports-list">
              {filteredReports.map((report) => (
                <div
                  key={report.id}
                  className={`report-card ${selectedReport === report.id ? "selected" : ""}`}
                  onClick={() => setSelectedReport(report.id)}
                >
                  <div className="report-header">
                    <h4>{report.title}</h4>
                    <span className="trash-type-badge">
                      {getTrashTypeIcon(report.trashType)} {report.trashType}
                    </span>
                  </div>
                  <p className="report-description">{report.description}</p>
                  <div className="report-meta">
                    <span>📢 {report.reportedBy}</span>
                    <span>📅 {report.reportedAt}</span>
                    <span className="points">⭐ {report.points} pts</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Details Panel */}
        <div className="details-section">
          {selectedReportData ? (
            <>
              <div className="detail-card">
                <h3>Report Details</h3>
                <div className="detail-group">
                  <label>Title:</label>
                  <p>{selectedReportData.title}</p>
                </div>
                <div className="detail-group">
                  <label>Description:</label>
                  <p>{selectedReportData.description}</p>
                </div>
                <div className="detail-group">
                  <label>Trash Type:</label>
                  <p>{getTrashTypeIcon(selectedReportData.trashType)} {selectedReportData.trashType}</p>
                </div>
                <div className="detail-group">
                  <label>Reward Points:</label>
                  <p className="points-highlight">⭐ {selectedReportData.points} points</p>
                </div>
                <div className="detail-group">
                  <label>Reported By:</label>
                  <p>{selectedReportData.reportedBy}</p>
                </div>
                <div className="detail-group">
                  <label>Report Date:</label>
                  <p>{selectedReportData.reportedAt}</p>
                </div>

                {selectedReportData.status === "pending-review" && (
                  <div className="action-section">
                    <h4>⚖️ Review Action</h4>
                    <button
                      className="btn-approve"
                      onClick={handleApprove}
                    >
                      ✅ Approve Report
                    </button>
                    <button
                      className="btn-reject"
                      onClick={handleReject}
                    >
                      ❌ Reject Report
                    </button>
                  </div>
                )}

                {(selectedReportData.status === "approved" || selectedReportData.status === "pending-review") && (
                  <div className="action-section">
                    <h4>👤 Assign Volunteer</h4>
                    <select
                      value={selectedEmployee || ""}
                      onChange={(e) => setSelectedEmployee(e.target.value)}
                      className="employee-select"
                    >
                      <option value="">Select a volunteer...</option>
                      {mockEmployees.map((emp) => (
                        <option key={emp.id} value={emp.id}>
                          {emp.name} • {emp.tasksCompleted} completed • ⭐ {emp.rating}
                        </option>
                      ))}
                    </select>
                    <button
                      className="btn-assign"
                      onClick={handleAssign}
                      disabled={isAssigning || !selectedEmployee}
                    >
                      {isAssigning ? "Assigning..." : "📤 Assign to Volunteer"}
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="empty-detail">
              <p>📋 Select a report to view details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

