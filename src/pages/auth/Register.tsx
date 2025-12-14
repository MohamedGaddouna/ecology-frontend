import "./Auth.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

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
    role: "USER",
  });
  const [error, setError] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (
      !formData.firstName ||
      !formData.lastName ||
      !formData.email ||
      !formData.password
    ) {
      setError("Please fill in all fields");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    const role = formData.role as "ADMIN" | "EMPLOYEE" | "USER";
    const name = `${formData.firstName} ${formData.lastName}`;

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
        <h2>Create Account</h2>

        {error && <div className="auth-error">{error}</div>}

        <form onSubmit={handleRegister}>
          <input
            name="firstName"
            placeholder="First Name"
            value={formData.firstName}
            onChange={handleChange}
          />
          <input
            name="lastName"
            placeholder="Last Name"
            value={formData.lastName}
            onChange={handleChange}
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
          />

          <select name="role" value={formData.role} onChange={handleChange}>
            <option value="USER">User</option>
            <option value="EMPLOYEE">Employee</option>
            <option value="ADMIN">Admin</option>
          </select>

          <button type="submit">Register</button>
        </form>

        <div className="auth-footer">
          Already have an account? <a href="/login">Sign in</a>
        </div>
      </div>
    </div>
  );
}
