import "./AssignTask.css";
import { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
import { getTasks, updateTaskStatus, assignMultipleUsersToTask } from "../../api/tasks";
import { getUsers } from "../../api/users";

interface TrashReport {
  id: string;
  title: string;
  description: string;
  picture: string;
  trashType: string;
  status: "pending-review" | "approved" | "rejected" | "assigned";
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
  // const navigate = useNavigate();
  const [selectedReport, setSelectedReport] = useState<string | null>(null);
  const [selectedEmployees, setSelectedEmployees] = useState<string[]>([]);
  const [filterStatus, setFilterStatus] = useState("pending-review");
  const [isAssigning, setIsAssigning] = useState(false);
  const [reports, setReports] = useState<TrashReport[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [tasksRes, usersRes] = await Promise.all([getTasks(), getUsers()]);

      // Process Tasks
      const mappedReports: TrashReport[] = tasksRes.data.map((task: any) => {
        let status: "pending-review" | "approved" | "rejected" | "assigned" = "pending-review";

        // Backend uses "pending", "approved", "rejected"
        if (task.status === "approved") {
          status = (task.userTasks && task.userTasks.length > 0) ? "assigned" : "approved";
        } else if (task.status === "rejected") {
          status = "rejected";
        } else {
          status = "pending-review";
        }

        return {
          id: task.id.toString(),
          title: task.title,
          description: task.description,
          picture: task.picture ? `${process.env.REACT_APP_API_URL}${task.picture}` : "/trash.jpg",
          trashType: task.category || "mixed",
          status: status,
          reportedBy: task.createdByUser ? `${task.createdByUser.firstName} ${task.createdByUser.lastName}` : "Unknown",
          reportedAt: new Date(task.createdAt).toLocaleDateString(),
          points: task.point || 0,
        };
      });
      setReports(mappedReports);

      // Process Employees
      const mappedEmployees: Employee[] = usersRes.data
        .filter((u: any) => u.role === "EMPLOYEE")
        .map((u: any) => ({
          id: u.id.toString(),
          name: `${u.firstName} ${u.lastName}`,
          tasksCompleted: u.userTasks ? u.userTasks.length : 0,
          rating: 5.0, // Placeholder
        }));
      setEmployees(mappedEmployees);

    } catch (err) {
      console.error("Failed to fetch data", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filteredReports = reports.filter((r) => {
    if (filterStatus === "pending-review") return r.status === "pending-review";
    if (filterStatus === "approved") return r.status === "approved";
    if (filterStatus === "assigned") return r.status === "assigned";
    if (filterStatus === "rejected") return r.status === "rejected";
    return true;
  });

  const selectedReportData = reports.find((r) => r.id === selectedReport);

  const handleStatusChange = async (status: "approved" | "rejected", points?: number) => {
    if (!selectedReport) return;
    try {
      await updateTaskStatus(selectedReport, status, points);

      alert(status === "approved" ? "Report Approved!" : "Report Rejected!");
      fetchData(); // Refresh list
      setSelectedReport(null);
    } catch (err) {
      console.error("Failed to update status", err);
      alert("Failed to update task status");
    }
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
    return icons[type.toLowerCase()] || "📦";
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
              <option value="rejected">❌ Rejected</option>
            </select>
          </div>

          {loading ? (
            <div className="empty-state"><p>Loading reports...</p></div>
          ) : filteredReports.length === 0 ? (
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

                    <div className="points-input-group" style={{ marginBottom: '15px' }}>
                      <label style={{ display: 'block', marginBottom: '5px' }}>Assign Points:</label>
                      <input
                        type="number"
                        min="0"
                        max="1000"
                        defaultValue={selectedReportData.points || 50}
                        id="admin-assign-points"
                        style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc', width: '100px' }}
                      />
                    </div>

                    <button
                      className="btn-approve"
                      onClick={() => {
                        const pointsInput = document.getElementById('admin-assign-points') as HTMLInputElement;
                        const points = pointsInput ? parseInt(pointsInput.value) : 0;
                        handleStatusChange("approved", points);
                      }}
                    >
                      ✅ Approve Report
                    </button>
                    <button
                      className="btn-reject"
                      onClick={() => handleStatusChange("rejected")}
                    >
                      ❌ Reject Report
                    </button>
                  </div>
                )}

                {/* Assign Section */}
                {(selectedReportData.status === "approved") && (
                  <div className="action-section">
                    <h4>👥 Assign Volunteers</h4>
                    <div className="employees-list" style={{ maxHeight: '200px', overflowY: 'auto', marginBottom: '10px' }}>
                      {employees.map((emp) => (
                        <label key={emp.id} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px', cursor: 'pointer' }}>
                          <input
                            type="checkbox"
                            checked={selectedEmployees.includes(emp.id)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedEmployees([...selectedEmployees, emp.id]);
                              } else {
                                setSelectedEmployees(selectedEmployees.filter(id => id !== emp.id));
                              }
                            }}
                          />
                          {emp.name} • {emp.tasksCompleted} tasks
                        </label>
                      ))}
                    </div>
                    <button
                      className="btn-assign"
                      onClick={async () => {
                        if (selectedEmployees.length === 0) return;
                        setIsAssigning(true);
                        try {
                          await assignMultipleUsersToTask(
                            selectedReportData.id,
                            selectedEmployees.map(id => parseInt(id))
                          );
                          alert(`Assigned to ${selectedEmployees.length} volunteer(s) successfully!`);
                          fetchData(); // Refresh
                          setSelectedReport(null);
                          setSelectedEmployees([]);
                        } catch (e) {
                          alert("Failed to assign");
                        } finally {
                          setIsAssigning(false);
                        }
                      }}
                      disabled={isAssigning || selectedEmployees.length === 0}
                    >
                      {isAssigning ? "Assigning..." : `📤 Assign to ${selectedEmployees.length} Volunteer(s)`}
                    </button>
                  </div>
                )}

                {selectedReportData.status === "rejected" && (
                  <div className="status-banner rejected">
                    ❌ This report has been rejected.
                  </div>
                )}

                {selectedReportData.status === "assigned" && (
                  <div className="status-banner assigned">
                    👤 This report has been assigned.
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

