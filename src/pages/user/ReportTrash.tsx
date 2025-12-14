import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./ReportTrash.css";

interface ReportFormData {
  title: string;
  description: string;
  picture: File | null;
  picturePrev: string;
  latitude: string;
  longitude: string;
  points: string;
  trashType: string;
}

export default function ReportTrash() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<ReportFormData>({
    title: "",
    description: "",
    picture: null,
    picturePrev: "",
    latitude: "",
    longitude: "",
    points: "",
    trashType: "mixed",
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
        setFormData((prev) => ({
          ...prev,
          latitude: pos.coords.latitude.toFixed(6),
          longitude: pos.coords.longitude.toFixed(6),
        }));
        setLoading(false);
        setError("");
      },
      () => {
        setError("Failed to get location. Please enable GPS or enter manually.");
        setLoading(false);
      }
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.title.trim()) {
      setError("Please enter a location name");
      return;
    }
    if (formData.title.trim().length < 5) {
      setError("Location name must be at least 5 characters");
      return;
    }
    if (!formData.description.trim()) {
      setError("Please describe the trash/waste");
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
    if (!formData.points || isNaN(parseInt(formData.points))) {
      setError("Please enter reward points (10-500)");
      return;
    }
    if (!formData.picture) {
      setError("Please upload a photo of the trash location");
      return;
    }

    // Simulate submission
    setLoading(true);
    setTimeout(() => {
      setSuccess(true);
      setLoading(false);
      setTimeout(() => {
        navigate("/user/reports");
      }, 2000);
    }, 1500);
  };

  return (
    <div className="page">
      <div className="report-header">
        <h2>♻️ Report Trash Location</h2>
        <p>Help us clean the environment! Share trash locations and earn rewards when volunteers clean them up.</p>
      </div>

      <form onSubmit={handleSubmit} className="report-form-container">
        <div className="form-card">
          {error && <div className="form-error">{error}</div>}
          {success && (
            <div className="form-success">
              ✅ Report submitted successfully! It will be reviewed by our team. You'll earn ⭐ {formData.points} points when the cleanup is completed. Redirecting...
            </div>
          )}

          {/* Location Name Field */}
          <div className="form-group">
            <label htmlFor="title">Location Name *</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g., Near park entrance, Behind shopping mall"
              disabled={loading}
            />
            <span className="char-count">
              {formData.title.length} / 100
            </span>
          </div>

          {/* Description Field */}
          <div className="form-group">
            <label htmlFor="description">Trash Description *</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe what type of trash you see and how much. Examples: plastic bags, bottles, broken glass, metal waste, etc."
              rows={5}
              disabled={loading}
            />
            <span className="char-count">
              {formData.description.length} / 500
            </span>
          </div>

          {/* Photo Upload */}
          <div className="form-group">
            <label htmlFor="picture">Photo of Trash Location *</label>
            <div className="file-input-wrapper">
              <input
                type="file"
                id="picture"
                accept="image/*"
                onChange={handleImageChange}
                disabled={loading}
              />
              <span>📷 Click to upload or take a photo</span>
            </div>
            {formData.picturePrev && (
              <div className="image-preview">
                <img src={formData.picturePrev} alt="Preview" />
                <p className="preview-label">Photo Preview</p>
              </div>
            )}
          </div>

          {/* Trash Type and GPS */}
          <div className="form-row">
            <div className="form-group half">
              <label htmlFor="trashType">Trash Type *</label>
              <select
                id="trashType"
                name="trashType"
                value={formData.trashType}
                onChange={handleChange}
                disabled={loading}
              >
                <option value="mixed">Mixed Waste</option>
                <option value="plastic">Plastic</option>
                <option value="glass">Glass & Bottles</option>
                <option value="metal">Metal & Cans</option>
                <option value="organic">Organic Waste</option>
                <option value="hazardous">Hazardous Materials</option>
              </select>
            </div>

            <div className="form-group half">
              <label>Reward Points (Incentive) *</label>
              <input
                type="number"
                name="points"
                value={formData.points}
                onChange={handleChange}
                placeholder="e.g., 100"
                min="10"
                max="500"
                disabled={loading}
              />
              <span className="helper-text">Higher points = faster cleanup (recommended: 50-150)</span>
            </div>
          </div>

          {/* GPS Location */}
          <div className="gps-section">
            <h3>📍 Location Coordinates</h3>
            <div className="form-row">
              <div className="form-group half">
                <label htmlFor="latitude">Latitude *</label>
                <input
                  type="text"
                  id="latitude"
                  name="latitude"
                  value={formData.latitude}
                  placeholder="Click Get Location"
                  readOnly
                />
              </div>

              <div className="form-group half">
                <label htmlFor="longitude">Longitude *</label>
                <input
                  type="text"
                  id="longitude"
                  name="longitude"
                  value={formData.longitude}
                  placeholder="Click Get Location"
                  readOnly
                />
              </div>
            </div>

            <button
              type="button"
              className="btn-gps"
              onClick={getGPSLocation}
              disabled={loading}
            >
              📍 Get Current Location (GPS)
            </button>
          </div>

          {/* Form Actions */}
          <div className="form-actions">
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? "Submitting Report..." : "✅ Submit Report"}
            </button>
            <button
              type="button"
              className="btn-secondary"
              onClick={() => navigate("/user/reports")}
              disabled={loading}
            >
              Cancel
            </button>
          </div>
        </div>

        {/* Info Card */}
        <div className="info-card">
          <h3>🎯 How It Works</h3>
          <ul>
            <li>📸 <strong>Take a clear photo</strong> showing the trash</li>
            <li>📍 <strong>Share exact location</strong> using GPS</li>
            <li>✏️ <strong>Describe the waste</strong> type and quantity</li>
            <li>⭐ <strong>Set reward points</strong> as incentive</li>
            <li>⏳ <strong>Wait for approval</strong> from our team</li>
            <li>👥 <strong>Volunteers cleanup</strong> the location</li>
            <li>🏆 <strong>Earn points</strong> when completed!</li>
          </ul>
        </div>
      </form>
    </div>
  );
}
