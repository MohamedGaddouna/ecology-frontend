import "./Auth.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signup } from "../../api/auth"; // Adjust the import path

interface RegisterProps {
  onLogin?: (role: "ADMIN" | "EMPLOYEE" | "USER", name: string) => void;
}

export default function Register({ onLogin }: RegisterProps) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",

  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (
      !formData.firstName ||
      !formData.lastName ||
      !formData.email ||
      !formData.password
    ) {
      setError("Please fill in all fields");
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters");
      setLoading(false);
      return;
    }

    try {
      // Call the signup API
      const response = await signup(formData);

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
      const errorMessage =
        err.response?.data?.message ||
        err.response?.data ||
        err.message ||
        "Registration failed. Please try again.";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="auth-page-wrapper">
      <div className="auth-container">
        <h2>Create Account</h2>

        {error && <div className="auth-error">{error}</div>}

        <form onSubmit={handleRegister}>
          <input
            name="firstName"
            placeholder="First Name"
            value={formData.firstName}
            onChange={handleChange}
            disabled={loading}
          />
          <input
            name="lastName"
            placeholder="Last Name"
            value={formData.lastName}
            onChange={handleChange}
            disabled={loading}
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            disabled={loading}
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            disabled={loading}
          />



          <button type="submit" disabled={loading}>
            {loading ? "Registering..." : "Register"}
          </button>
        </form>

        <div className="auth-footer">
          Already have an account? <a href="/login">Sign in</a>
        </div>
      </div>
    </div>
  );
}
