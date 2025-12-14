import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Navigation from "./components/Navigation";

// Auth
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";

// User
import ReportTrash from "./pages/user/ReportTrash";
import MyReports from "./pages/user/MyReports";
import UserProfile from "./pages/user/UserProfile";
import UserDashboard from "./pages/user/UserDashboard";

// Admin
import AdminDashboard from "./pages/admin/AdminDashboard";
import AssignTask from "./pages/admin/AssignTask";
import ManageUsers from "./pages/admin/ManageUsers";

// Employee
import MyTasks from "./pages/employee/MyTasks";
import EmployeeDashboard from "./pages/employee/EmployeeDashboard";

// Common
import Profile from "./pages/common/Profile";
import TaskDetails from "./pages/common/TaskDetails";
import CreateComplaint from "./pages/common/CreateComplaint";
import ComplaintsList from "./pages/common/ComplaintsList";
import ComplaintDetails from "./pages/common/ComplaintDetails";

type UserRole = "ADMIN" | "EMPLOYEE" | "USER" | undefined;

function App() {
  const [userRole, setUserRole] = useState<UserRole>(undefined);
  const [userName, setUserName] = useState<string>("Guest");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Load user from localStorage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      try {
        const user = JSON.parse(savedUser);
        setUserRole(user.role);
        setUserName(user.name);
        setIsLoggedIn(true);
      } catch {
        localStorage.removeItem("user");
      }
    }
  }, []);

  const handleLogin = (role: UserRole, name: string) => {
    setUserRole(role);
    setUserName(name);
    setIsLoggedIn(true);
    localStorage.setItem("user", JSON.stringify({ role, name }));
  };

  const handleLogout = () => {
    setUserRole(undefined);
    setUserName("Guest");
    setIsLoggedIn(false);
    localStorage.removeItem("user");
  };

  // Protected Route Component
  const ProtectedRoute = ({
    element,
    allowedRoles,
  }: {
    element: React.ReactElement;
    allowedRoles: (UserRole)[];
  }) => {
    if (!isLoggedIn || !userRole || !allowedRoles.includes(userRole)) {
      return <Navigate to="/login" replace />;
    }
    return element;
  };

  return (
    <BrowserRouter>
      {isLoggedIn && (
        <Navigation
          userRole={userRole}
          userName={userName}
          onLogout={handleLogout}
        />
      )}

      <Routes>
        {/* Public Routes */}
        <Route
          path="/login"
          element={<Login onLogin={handleLogin} />}
        />
        <Route
          path="/register"
          element={<Register onLogin={handleLogin} />}
        />

        {/* User Routes */}
        <Route
          path="/user/dashboard"
          element={
            <ProtectedRoute
              element={<UserDashboard />}
              allowedRoles={["USER"]}
            />
          }
        />
        <Route
          path="/user/report-trash"
          element={
            <ProtectedRoute
              element={<ReportTrash />}
              allowedRoles={["USER"]}
            />
          }
        />
        <Route
          path="/user/reports"
          element={
            <ProtectedRoute
              element={<MyReports />}
              allowedRoles={["USER"]}
            />
          }
        />

        {/* Admin Routes */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute
              element={<AdminDashboard />}
              allowedRoles={["ADMIN"]}
            />
          }
        />
        <Route
          path="/admin/assign"
          element={
            <ProtectedRoute
              element={<AssignTask />}
              allowedRoles={["ADMIN"]}
            />
          }
        />
        <Route
          path="/admin/manage-users"
          element={
            <ProtectedRoute
              element={<ManageUsers />}
              allowedRoles={["ADMIN"]}
            />
          }
        />

        {/* Employee Routes */}
        <Route
          path="/employee"
          element={
            <ProtectedRoute
              element={<EmployeeDashboard />}
              allowedRoles={["EMPLOYEE"]}
            />
          }
        />
        <Route
          path="/employee/tasks"
          element={
            <ProtectedRoute
              element={<MyTasks />}
              allowedRoles={["EMPLOYEE"]}
            />
          }
        />

        {/* Common Routes */}
        <Route
          path="/user/profile"
          element={
            <ProtectedRoute
              element={<UserProfile />}
              allowedRoles={["USER", "EMPLOYEE", "ADMIN"]}
            />
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute
              element={<Profile />}
              allowedRoles={["USER", "EMPLOYEE", "ADMIN"]}
            />
          }
        />
        <Route
          path="/task/:id"
          element={
            <ProtectedRoute
              element={<TaskDetails />}
              allowedRoles={["USER", "EMPLOYEE", "ADMIN"]}
            />
          }
        />

        {/* Complaint Routes */}
        <Route
          path="/complaints/create"
          element={
            <ProtectedRoute
              element={<CreateComplaint />}
              allowedRoles={["USER", "EMPLOYEE", "ADMIN"]}
            />
          }
        />
        <Route
          path="/complaints"
          element={
            <ProtectedRoute
              element={<ComplaintsList />}
              allowedRoles={["USER", "EMPLOYEE", "ADMIN"]}
            />
          }
        />
        <Route
          path="/complaints/:id"
          element={
            <ProtectedRoute
              element={<ComplaintDetails />}
              allowedRoles={["USER", "EMPLOYEE", "ADMIN"]}
            />
          }
        />

        {/* Catch-all */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
