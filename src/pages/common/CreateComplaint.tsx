import "./CreateComplaint.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createComplain } from "../../api/complains";

export default function CreateComplaint() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
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

    const userId = localStorage.getItem("ecology_user_id");
    if (!userId) {
      setError("User not logged in");
      return;
    }

    setLoading(true);
    try {
      await createComplain({
        title: formData.title,
        description: formData.description,
        userId: parseInt(userId),
      });
      setSuccess("Complaint submitted successfully!");
      setTimeout(() => {
        navigate("/complaints");
      }, 1500);
    } catch (err) {
      console.error("Failed to submit complaint", err);
      setError("Failed to submit complaint. Please try again.");
    } finally {
      setLoading(false);
    }
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
                disabled={loading}
              />
              <span className="char-count">
                {formData.title.length}/100
              </span>
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
                disabled={loading}
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
                disabled={loading}
              >
                Cancel
              </button>
              <button type="submit" className="btn-primary" disabled={loading}>
                {loading ? "Submitting..." : "Submit Complaint"}
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
