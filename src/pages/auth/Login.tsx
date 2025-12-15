import "./Auth.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../../api/auth"; // Import login function

interface LoginProps {
  onLogin?: (role: "ADMIN" | "EMPLOYEE" | "USER", name: string) => void;
}

export default function Login({ onLogin }: LoginProps) {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!email || !password) {
      setError("Please fill in all fields");
      setLoading(false);
      return;
    }

    try {
      // Call the login API
      const response = await login({ email, password });

      // API returns flat structure: { token, id, email, firstName, lastName, role }
      const { token, firstName, lastName, role } = response.data;

      // Store token in localStorage
      localStorage.setItem("ecology_token", token);
      localStorage.setItem("ecology_user_id", response.data.id);

      // Get role and name
      const userRole = role as "ADMIN" | "EMPLOYEE" | "USER";
      const name = `${firstName} ${lastName}`;

      // Call onLogin callback
      if (onLogin) {
        onLogin(userRole, name);
      }

      // Navigate based on role
      switch (userRole) {
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
    } catch (err: any) {
      // Handle errors from API
      console.error("Login error:", err.response?.data || err.message);

      const errorMessage =
        err.response?.data?.message ||
        err.response?.data ||
        err.message ||
        "Login failed. Please check your credentials.";
      setError(errorMessage);
    } finally {
      setLoading(false);
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
            disabled={loading}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
          />

          <button type="submit" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <div className="auth-footer">
          Don't have an account? <a href="/register">Create one</a>
        </div>
      </div>
    </div>
  );
}
