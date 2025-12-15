import { useState, useEffect } from "react";
import { getUsers, updateUser, deleteUser } from "../../api/users";
import "./AssignTask.css"; // Reuse basic styles

export default function ManageUsers() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      const res = await getUsers();
      setUsers(res.data);
    } catch (err) {
      console.error("Failed to fetch users", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleRoleChange = async (userId: number, newRole: string) => {
    try {
      const user = users.find((u) => u.id === userId);
      if (!user) return;

      await updateUser(userId, { ...user, role: newRole });
      alert(`User role updated to ${newRole}`);
      fetchUsers();
    } catch (err) {
      console.error("Failed to update role", err);
      alert("Failed to update user role");
    }
  };

  const handleDelete = async (userId: number) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      await deleteUser(userId);
      alert("User deleted successfully");
      fetchUsers();
    } catch (err) {
      console.error("Failed to delete user", err);
      alert("Failed to delete user");
    }
  };

  if (loading) return <div className="page loading">Loading users...</div>;

  return (
    <div className="page">
      <div className="approval-header">
        <h2>👥 Manage Users</h2>
        <p>View and manage user accounts and roles.</p>
      </div>

      <div className="add-user-section" style={{ marginBottom: "20px", padding: "15px", background: "white", borderRadius: "8px", boxShadow: "0 2px 4px rgba(0,0,0,0.1)" }}>
        <h3>➕ Add New User</h3>
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            const form = e.target as HTMLFormElement;
            const formData = new FormData(form);
            const data = Object.fromEntries(formData.entries());

            try {
              // Import dynamically to avoid circular dependency issues if any, or just use the API
              const { createUser } = await import("../../api/users");
              await createUser(data);
              alert("User created successfully!");
              form.reset();
              fetchUsers();
            } catch (err: any) {
              console.error("Failed to create user", err);
              alert(err.response?.data?.message || "Failed to create user");
            }
          }}
          style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "10px", alignItems: "end" }}
        >
          <div>
            <label style={{ display: "block", marginBottom: "5px" }}>First Name</label>
            <input name="firstName" required style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #ddd" }} />
          </div>
          <div>
            <label style={{ display: "block", marginBottom: "5px" }}>Last Name</label>
            <input name="lastName" required style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #ddd" }} />
          </div>
          <div>
            <label style={{ display: "block", marginBottom: "5px" }}>Email</label>
            <input name="email" type="email" required style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #ddd" }} />
          </div>
          <div>
            <label style={{ display: "block", marginBottom: "5px" }}>Password</label>
            <input name="password" type="password" required minLength={6} style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #ddd" }} />
          </div>
          <div>
            <label style={{ display: "block", marginBottom: "5px" }}>Role</label>
            <select name="role" defaultValue="EMPLOYEE" style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #ddd" }}>
              <option value="USER">User</option>
              <option value="EMPLOYEE">Employee</option>
              <option value="ADMIN">Admin</option>
            </select>
          </div>
          <button type="submit" style={{ padding: "10px", background: "#10b981", color: "white", border: "none", borderRadius: "4px", cursor: "pointer", fontWeight: "bold" }}>
            Create User
          </button>
        </form>
      </div>

      <div className="task-list">
        <table style={{ width: "100%", borderCollapse: "collapse", background: "white", borderRadius: "8px", overflow: "hidden", boxShadow: "0 2px 4px rgba(0,0,0,0.1)" }}>
          <thead style={{ background: "#f3f4f6" }}>
            <tr>
              <th style={{ padding: "12px", textAlign: "left" }}>ID</th>
              <th style={{ padding: "12px", textAlign: "left" }}>Name</th>
              <th style={{ padding: "12px", textAlign: "left" }}>Email</th>
              <th style={{ padding: "12px", textAlign: "left" }}>Role</th>
              <th style={{ padding: "12px", textAlign: "left" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} style={{ borderBottom: "1px solid #eee" }}>
                <td style={{ padding: "12px" }}>{user.id}</td>
                <td style={{ padding: "12px" }}>{user.firstName} {user.lastName}</td>
                <td style={{ padding: "12px" }}>{user.email}</td>
                <td style={{ padding: "12px" }}>
                  <select
                    value={user.role}
                    onChange={(e) => handleRoleChange(user.id, e.target.value)}
                    style={{ padding: "6px", borderRadius: "4px", border: "1px solid #ddd" }}
                  >
                    <option value="USER">User</option>
                    <option value="EMPLOYEE">Employee</option>
                    <option value="ADMIN">Admin</option>
                  </select>
                </td>
                <td style={{ padding: "12px" }}>
                  <button
                    onClick={() => handleDelete(user.id)}
                    style={{ background: "#ef4444", color: "white", border: "none", padding: "6px 12px", borderRadius: "4px", cursor: "pointer" }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
