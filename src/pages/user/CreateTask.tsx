import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./CreateTask.css";
import { createTask } from "../../api/tasks";

interface TaskFormData {
  title: string;
  description: string;
  picture: File | null;
  picturePrev: string;
  latitude: string;
  longitude: string;

  category: string;
  priority: string;
}

export default function CreateTask() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<TaskFormData>({
    title: "",
    description: "",
    picture: null,
    picturePrev: "",
    latitude: "",
    longitude: "",

    category: "trash",
    priority: "medium",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError("");
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({
          ...prev,
          picture: file,
          picturePrev: reader.result as string,
        }));
      };
      reader.readAsDataURL(file);
    }
    setError("");
  };

  const getGPSLocation = () => {
    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        console.log("GPS Position:", pos);
        setFormData((prev) => ({
          ...prev,
          latitude: pos.coords.latitude.toFixed(6),
          longitude: pos.coords.longitude.toFixed(6),
        }));
        setLoading(false);
        setError("");
      },
      () => {
        setError("Failed to get location. Please enable GPS.");
        setLoading(false);
      }
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.title.trim()) {
      setError("Please enter a task title");
      return;
    }
    if (formData.title.trim().length < 5) {
      setError("Title must be at least 5 characters");
      return;
    }
    if (!formData.description.trim()) {
      setError("Please enter a description");
      return;
    }
    if (formData.description.trim().length < 20) {
      setError("Description must be at least 20 characters");
      return;
    }
    if (!formData.latitude || !formData.longitude) {
      setError("Please provide GPS coordinates");
      return;
    }

    if (!formData.picture) {
      setError("Please upload a picture");
      return;
    }

    const userId = localStorage.getItem("ecology_user_id");
    if (!userId) {
      setError("User not logged in");
      return;
    }

    setLoading(true);

    try {
      const apiFormData = new FormData();
      // Combine title and description or just use description as backend only has description
      // Backend Task model has description. CreateTaskRequest has description.
      // I'll prepend title to description to keep it.
      apiFormData.append("description", `${formData.title}: ${formData.description}`);

      apiFormData.append("latitude", formData.latitude);
      apiFormData.append("longitude", formData.longitude);
      apiFormData.append("approved", "pending"); // Default to pending
      apiFormData.append("createdByUserId", userId);
      apiFormData.append("pictureFile", formData.picture);

      await createTask(apiFormData);

      setSuccess(true);
      setTimeout(() => {
        navigate("/user/tasks");
      }, 2000);
    } catch (err: any) {
      console.error("Failed to create task", err);
      setError(err.response?.data?.message || "Failed to create task");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <div className="task-header">
        <h2>📝 Create New Task</h2>
        <p>Report trash location and earn points for cleaning</p>
      </div>

      <form onSubmit={handleSubmit} className="task-form-container">
        <div className="form-card">
          {error && <div className="form-error">{error}</div>}
          {success && (
            <div className="form-success">
              Task created successfully! Redirecting...
            </div>
          )}

          {/* Title Field */}
          <div className="form-group">
            <label htmlFor="title">Task Title *</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g., Trash near park entrance"
              disabled={loading}
            />
            <span className="char-count">
              {formData.title.length} / 100
            </span>
          </div>

          {/* Description Field */}
          <div className="form-group">
            <label htmlFor="description">Description *</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe the trash location and type of waste..."
              rows={5}
              disabled={loading}
            />
            <span className="char-count">
              {formData.description.length} / 500
            </span>
          </div>

          {/* Picture Upload */}
          <div className="form-group">
            <label htmlFor="picture">Picture *</label>
            <div className="file-input-wrapper">
              <input
                type="file"
                id="picture"
                accept="image/*"
                onChange={handleImageChange}
                disabled={loading}
              />
              <span>Choose picture or take a photo</span>
            </div>
            {formData.picturePrev && (
              <div className="image-preview">
                <img src={formData.picturePrev} alt="Preview" />
              </div>
            )}
          </div>

          {/* Category and Priority */}
          <div className="form-row">
            <div className="form-group half">
              <label htmlFor="category">Category *</label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                disabled={loading}
              >
                <option value="trash">Trash</option>
                <option value="plastic">Plastic</option>
                <option value="glass">Glass</option>
                <option value="metal">Metal</option>
                <option value="hazardous">Hazardous</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div className="form-group half">
              <label htmlFor="priority">Priority *</label>
              <select
                id="priority"
                name="priority"
                value={formData.priority}
                onChange={handleChange}
                disabled={loading}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>
          </div>

          {/* GPS Location */}
          <div className="form-row">
            <div className="form-group half">
              <label htmlFor="latitude">Latitude *</label>
              <input
                type="text"
                id="latitude"
                name="latitude"
                value={formData.latitude}
                placeholder="Click Get GPS Location or enter manually"
                onChange={handleChange}
              />
            </div>

            <div className="form-group half">
              <label htmlFor="longitude">Longitude *</label>
              <input
                type="text"
                id="longitude"
                name="longitude"
                value={formData.longitude}
                placeholder="Click Get GPS Location or enter manually"
                onChange={handleChange}
              />
            </div>
          </div>

          <button
            type="button"
            className="btn-gps"
            onClick={getGPSLocation}
            disabled={loading}
          >
            📍 Get GPS Location
          </button>



          {/* Form Actions */}
          <div className="form-actions">
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? "Submitting..." : "🚀 Create Task"}
            </button>
            <button
              type="button"
              className="btn-secondary"
              onClick={() => navigate("/user/tasks")}
              disabled={loading}
            >
              Cancel
            </button>
          </div>
        </div>

        {/* Info Card */}
        <div className="info-card">
          <h3>📋 Task Guidelines</h3>
          <ul>
            <li>Accurate location is crucial</li>
            <li>Clear pictures help verification</li>
            <li>Point value affects employee interest</li>
            <li>Higher priority = faster completion</li>
            <li>Tasks are reviewed before approval</li>
            <li>Approved tasks appear in employee feed</li>
          </ul>
        </div>
      </form>
    </div>
  );
}
