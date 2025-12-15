import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
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
import AdminAnalytics from "./pages/admin/AdminAnalytics";

// Employee
import MyTasks from "./pages/employee/MyTasks";
import EmployeeDashboard from "./pages/employee/EmployeeDashboard";

// Common
import Profile from "./pages/common/Profile";
import TaskDetails from "./pages/common/TaskDetails";
import CreateComplaint from "./pages/common/CreateComplaint";
import ComplaintsList from "./pages/common/ComplaintsList";
import ComplaintDetails from "./pages/common/ComplaintDetails";
import RootLayout from "./pages/rootLayout/RootLayout";

type UserRole = "ADMIN" | "EMPLOYEE" | "USER" | undefined;

export default function App() {
  const [userRole, setUserRole] = useState<UserRole>(undefined);
  const [userName, setUserName] = useState<string>("Guest");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Load user from localStorage on mount
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("ecology_token");
      const userId = localStorage.getItem("ecology_user_id");

      if (token && userId) {
        try {
          // Import dynamically to avoid circular dependencies if any, or just use the API
          const { getUser } = await import("./api/users");
          const response = await getUser(userId);
          const user = response.data;

          setUserRole(user.role); // Assuming backend returns role
          setUserName(`${user.firstName} ${user.lastName}`);
          setIsLoggedIn(true);
        } catch (error) {
          console.error("Session validation failed", error);
          handleLogout();
        }
      }
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  const handleLogin = (role: UserRole, name: string) => {
    setUserRole(role);
    setUserName(name);
    setIsLoggedIn(true);
    // Token is already set in Login/Register components
  };

  const handleLogout = () => {
    setUserRole(undefined);
    setUserName("Guest");
    setIsLoggedIn(false);
    localStorage.removeItem("ecology_token");
    localStorage.removeItem("ecology_user_id");
    localStorage.removeItem("user"); // Cleanup old key if exists
  };

  // Protected Route Component
  const ProtectedRoute = ({
    element,
    allowedRoles,
  }: {
    element: React.ReactElement;
    allowedRoles: (UserRole)[];
  }) => {
    if (isLoading) {
      return <div>Loading...</div>; // Or a proper loading spinner
    }
    if (!isLoggedIn || !userRole || !allowedRoles.includes(userRole)) {
      return <Navigate to="/login" replace />;
    }
    return element;
  };

  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes - Outside Layout */}
        <Route path="/login" element={<Login onLogin={handleLogin} />} />
        <Route path="/register" element={<Register onLogin={handleLogin} />} />

        {/* All Protected Routes - Inside Layout */}
        <Route
          element={
            <ProtectedRoute
              element={<RootLayout userRole={userRole} userName={userName} onLogout={handleLogout} />}
              allowedRoles={["USER", "EMPLOYEE", "ADMIN"]}
            />
          }
        >
          {/* User Routes */}
          <Route
            path="/user/dashboard"
            element={
              <ProtectedRoute element={<UserDashboard />} allowedRoles={["USER"]} />
            }
          />
          <Route
            path="/user/report-trash"
            element={
              <ProtectedRoute element={<ReportTrash />} allowedRoles={["USER"]} />
            }
          />
          <Route
            path="/user/reports"
            element={
              <ProtectedRoute element={<MyReports />} allowedRoles={["USER"]} />
            }
          />

          {/* Admin Routes */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute element={<AdminDashboard />} allowedRoles={["ADMIN"]} />
            }
          />
          <Route
            path="/admin/assign"
            element={
              <ProtectedRoute element={<AssignTask />} allowedRoles={["ADMIN"]} />
            }
          />
          <Route
            path="/admin/analytics"
            element={
              <ProtectedRoute element={<AdminAnalytics />} allowedRoles={["ADMIN"]} />
            }
          />
          <Route
            path="/admin/manage-users"
            element={
              <ProtectedRoute element={<ManageUsers />} allowedRoles={["ADMIN"]} />
            }
          />

          {/* Employee Routes */}
          <Route
            path="/employee"
            element={
              <ProtectedRoute element={<EmployeeDashboard />} allowedRoles={["EMPLOYEE"]} />
            }
          />
          <Route
            path="/employee/tasks"
            element={
              <ProtectedRoute element={<MyTasks />} allowedRoles={["EMPLOYEE"]} />
            }
          />

          {/* Common Routes */}
          <Route path="/user/profile" element={<UserProfile />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/task/:id" element={<TaskDetails />} />
          <Route path="/cleanup/:id" element={<TaskDetails />} />
          <Route path="/complaints/create" element={<CreateComplaint />} />
          <Route path="/complaints" element={<ComplaintsList />} />
          <Route path="/complaints/:id" element={<ComplaintDetails />} />
        </Route>

        {/* Catch-all */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
