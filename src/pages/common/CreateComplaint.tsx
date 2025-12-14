import "./CreateComplaint.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function CreateComplaint() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "general",
    priority: "medium",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!formData.title || !formData.description) {
      setError("Please fill in all required fields");
      return;
    }

    if (formData.title.length < 5) {
      setError("Title must be at least 5 characters");
      return;
    }

    if (formData.description.length < 20) {
      setError("Description must be at least 20 characters");
      return;
    }

    setSuccess("Complaint submitted successfully!");
    setTimeout(() => {
      navigate("/complaints");
    }, 1500);
  };

  return (
    <div className="page">
      <div className="complaint-header">
        <h2>📝 Submit a Complaint</h2>
        <p>Help us improve by reporting issues or concerns</p>
      </div>

      <div className="complaint-form-container">
        <div className="form-card">
          {error && <div className="form-error">{error}</div>}
          {success && <div className="form-success">{success}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Title *</label>
              <input
                type="text"
                name="title"
                placeholder="Brief title of your complaint"
                value={formData.title}
                onChange={handleChange}
                maxLength={100}
              />
              <span className="char-count">
                {formData.title.length}/100
              </span>
            </div>

            <div className="form-row">
              <div className="form-group half">
                <label>Category</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                >
                  <option value="general">General Issue</option>
                  <option value="technical">Technical Problem</option>
                  <option value="task">Task Related</option>
                  <option value="user">User Behavior</option>
                  <option value="safety">Safety Concern</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div className="form-group half">
                <label>Priority</label>
                <select
                  name="priority"
                  value={formData.priority}
                  onChange={handleChange}
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="urgent">Urgent</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label>Description *</label>
              <textarea
                name="description"
                placeholder="Please provide detailed information about your complaint..."
                value={formData.description}
                onChange={handleChange}
                maxLength={2000}
                rows={8}
              />
              <span className="char-count">
                {formData.description.length}/2000
              </span>
            </div>

            <div className="form-actions">
              <button
                type="button"
                className="btn-secondary"
                onClick={() => navigate("/complaints")}
              >
                Cancel
              </button>
              <button type="submit" className="btn-primary">
                Submit Complaint
              </button>
            </div>
          </form>
        </div>

        <div className="info-card">
          <h3>📌 Guidelines</h3>
          <ul>
            <li>Be specific and detailed in your complaint</li>
            <li>Include dates and times if relevant</li>
            <li>Describe the impact or consequence</li>
            <li>Suggest a solution if possible</li>
            <li>Be professional and respectful</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
