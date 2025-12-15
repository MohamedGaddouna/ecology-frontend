import { useState, useEffect } from "react";
import { getTasks } from "../../api/tasks";
import { getUsers } from "../../api/users";
import "./AssignTask.css"; // Reuse basic styles for now

export default function AdminAnalytics() {
    const [stats, setStats] = useState({
        totalTasks: 0,
        pendingTasks: 0,
        approvedTasks: 0,
        completedTasks: 0,
        totalPoints: 0,
    });
    const [leaderboard, setLeaderboard] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [tasksRes, usersRes] = await Promise.all([getTasks(), getUsers()]);
                const tasks = tasksRes.data;
                const users = usersRes.data;

                // Stats
                const totalTasks = tasks.length;
                const pendingTasks = tasks.filter((t: any) => t.approved === "pending").length;
                const approvedTasks = tasks.filter((t: any) => t.approved === "accepted").length;
                // Assuming completed if approved and has userTasks? Or need explicit completed status?
                // For now, let's just count assigned as "in progress/completed"
                const assignedTasks = tasks.filter((t: any) => t.userTasks && t.userTasks.length > 0).length;
                const totalPoints = tasks.reduce((sum: number, t: any) => sum + (t.point || 0), 0);

                setStats({
                    totalTasks,
                    pendingTasks,
                    approvedTasks,
                    completedTasks: assignedTasks, // Using assigned as proxy for now
                    totalPoints,
                });

                // Leaderboard (Employees by points from assigned tasks)
                // We need to sum points of tasks assigned to each employee
                const employees = users.filter((u: any) => u.role === "EMPLOYEE");
                const lb = employees.map((emp: any) => {
                    const empTasks = emp.userTasks || [];
                    const pointsEarned = empTasks.reduce((sum: number, ut: any) => sum + (ut.task?.point || 0), 0);
                    return {
                        id: emp.id,
                        name: `${emp.firstName} ${emp.lastName}`,
                        tasksCount: empTasks.length,
                        points: pointsEarned
                    };
                });

                // Sort by points desc
                lb.sort((a: any, b: any) => b.points - a.points);
                setLeaderboard(lb);

            } catch (err) {
                console.error("Failed to fetch analytics", err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) return <div className="page loading">Loading analytics...</div>;

    return (
        <div className="page">
            <div className="approval-header">
                <h2>📊 Analytics & Leaderboard</h2>
                <p>Overview of platform activity and top performers</p>
            </div>

            <div className="analytics-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "20px", marginBottom: "40px" }}>
                <div className="stat-card" style={{ background: "white", padding: "20px", borderRadius: "10px", boxShadow: "0 2px 4px rgba(0,0,0,0.05)" }}>
                    <h3>Total Reports</h3>
                    <p style={{ fontSize: "2rem", fontWeight: "bold", color: "#0c2d6b" }}>{stats.totalTasks}</p>
                </div>
                <div className="stat-card" style={{ background: "white", padding: "20px", borderRadius: "10px", boxShadow: "0 2px 4px rgba(0,0,0,0.05)" }}>
                    <h3>Pending Review</h3>
                    <p style={{ fontSize: "2rem", fontWeight: "bold", color: "#f59e0b" }}>{stats.pendingTasks}</p>
                </div>
                <div className="stat-card" style={{ background: "white", padding: "20px", borderRadius: "10px", boxShadow: "0 2px 4px rgba(0,0,0,0.05)" }}>
                    <h3>Approved/Assigned</h3>
                    <p style={{ fontSize: "2rem", fontWeight: "bold", color: "#10b981" }}>{stats.approvedTasks}</p>
                </div>
                <div className="stat-card" style={{ background: "white", padding: "20px", borderRadius: "10px", boxShadow: "0 2px 4px rgba(0,0,0,0.05)" }}>
                    <h3>Total Points</h3>
                    <p style={{ fontSize: "2rem", fontWeight: "bold", color: "#6366f1" }}>⭐ {stats.totalPoints}</p>
                </div>
            </div>

            <div className="leaderboard-section" style={{ background: "white", padding: "20px", borderRadius: "10px", boxShadow: "0 2px 4px rgba(0,0,0,0.05)" }}>
                <h3>🏆 Employee Leaderboard</h3>
                <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "20px" }}>
                    <thead>
                        <tr style={{ textAlign: "left", borderBottom: "2px solid #f3f4f6" }}>
                            <th style={{ padding: "10px" }}>Rank</th>
                            <th style={{ padding: "10px" }}>Employee</th>
                            <th style={{ padding: "10px" }}>Tasks Assigned</th>
                            <th style={{ padding: "10px" }}>Total Points</th>
                        </tr>
                    </thead>
                    <tbody>
                        {leaderboard.map((emp, index) => (
                            <tr key={emp.id} style={{ borderBottom: "1px solid #f3f4f6" }}>
                                <td style={{ padding: "15px 10px", fontWeight: "bold" }}>#{index + 1}</td>
                                <td style={{ padding: "15px 10px" }}>{emp.name}</td>
                                <td style={{ padding: "15px 10px" }}>{emp.tasksCount}</td>
                                <td style={{ padding: "15px 10px", color: "#10b981", fontWeight: "bold" }}>⭐ {emp.points}</td>
                            </tr>
                        ))}
                        {leaderboard.length === 0 && (
                            <tr>
                                <td colSpan={4} style={{ padding: "20px", textAlign: "center", color: "#6b7280" }}>No data available</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
