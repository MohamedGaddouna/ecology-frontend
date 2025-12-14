import { useNavigate } from "react-router-dom";
import "./Navigation.css";
import { useState } from "react";

interface NavigationProps {
  userRole?: "ADMIN" | "EMPLOYEE" | "USER";
  userName?: string;
  onLogout?: () => void;
}

export default function Navigation({
  userRole = "USER",
  userName = "User",
  onLogout,
}: NavigationProps) {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const menuItems = {
    ADMIN: [
      { label: "📊 Dashboard", path: "/admin" },
      { label: "� Review Reports", path: "/admin/assign" },
      { label: "👥 Manage Users", path: "/admin/manage-users" },
      { label: "💬 Complaints", path: "/complaints" },
    ],
    EMPLOYEE: [
      { label: "🧹 Cleanup Tasks", path: "/employee/tasks" },
      { label: "👤 Profile", path: "/user/profile" },
      { label: "💬 Complaints", path: "/complaints" },
      { label: "📢 Report Issue", path: "/complaints/create" },
    ],
    USER: [
      { label: "📊 Dashboard", path: "/user/dashboard" },
      { label: "♻️ Report Trash", path: "/user/report-trash" },
      { label: "📍 My Reports", path: "/user/reports" },
      { label: "👤 Profile", path: "/user/profile" },
      { label: "💬 Complaints", path: "/complaints" },
      { label: "📢 Report Issue", path: "/complaints/create" },
    ],
  };

  const currentMenu = menuItems[userRole] || menuItems.USER;

  const handleNavigate = (path: string) => {
    navigate(path);
    setMenuOpen(false);
  };

  const handleLogout = () => {
    if (onLogout) onLogout();
    navigate("/login");
    setMenuOpen(false);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Logo/Brand */}
        <div className="navbar-brand">
          <span className="navbar-logo" onClick={() => navigate("/")}>
            🌱 Ecology
          </span>
        </div>

        {/* Desktop Menu */}
        <div className="navbar-menu-desktop">
          <div className="menu-items">
            {currentMenu.map((item) => (
              <button
                key={item.path}
                className="menu-item"
                onClick={() => handleNavigate(item.path)}
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* User Info & Logout */}
          <div className="navbar-user">
            <span className="user-badge">{userRole}</span>
            <span className="user-name">{userName}</span>
            <button className="logout-btn" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="navbar-toggle"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <span className="hamburger">☰</span>
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="navbar-menu-mobile">
          <div className="mobile-menu-items">
            {currentMenu.map((item) => (
              <button
                key={item.path}
                className="mobile-menu-item"
                onClick={() => handleNavigate(item.path)}
              >
                {item.label}
              </button>
            ))}
            <div className="mobile-user-section">
              <span className="mobile-user-badge">{userRole}</span>
              <span className="mobile-user-name">{userName}</span>
            </div>
            <button className="mobile-logout-btn" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
