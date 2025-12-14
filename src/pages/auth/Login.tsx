import "./Auth.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

interface LoginProps {
  onLogin?: (role: "ADMIN" | "EMPLOYEE" | "USER", name: string) => void;
}

export default function Login({ onLogin }: LoginProps) {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please fill in all fields");
      return;
    }

    // Mock authentication - in a real app, this would call an API
    let role: "ADMIN" | "EMPLOYEE" | "USER" = "USER";
    let name = "User";

    if (email.includes("admin")) {
      role = "ADMIN";
      name = "Admin";
    } else if (email.includes("employee")) {
      role = "EMPLOYEE";
      name = "Employee";
    } else {
      role = "USER";
      name = "User";
    }

    if (onLogin) {
      onLogin(role, name);
    }

    // Navigate based on role
    switch (role) {
      case "ADMIN":
        navigate("/admin");
        break;
      case "EMPLOYEE":
        navigate("/employee");
        break;
      case "USER":
        navigate("/user/dashboard");
        break;
    }
  };

  return (
    <div className="auth-page-wrapper">
      <div className="auth-container">
        <h2>Welcome Back</h2>

        {error && <div className="auth-error">{error}</div>}

        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button type="submit">Login</button>
        </form>

        <div className="auth-footer">
          Don't have an account? <a href="/register">Create one</a>
        </div>

        <div className="auth-hint">
          <p>Demo Accounts:</p>
          <ul>
            <li>admin@example.com (Admin)</li>
            <li>employee@example.com (Employee)</li>
            <li>user@example.com (User)</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
