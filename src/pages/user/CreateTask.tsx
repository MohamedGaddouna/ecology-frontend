import { useState } from "react";
import "./CreateTask.css";

export default function CreateTask() {
  const [coords, setCoords] = useState<{lat:number,lng:number}|null>(null);

  const getGPS = () => {
    navigator.geolocation.getCurrentPosition(pos => {
      setCoords({
        lat: pos.coords.latitude,
        lng: pos.coords.longitude
      });
    });
  };

  return (
    <div className="page">
      <div className="card">
        <h2>📸 Report Trash</h2>

        <input type="file" accept="image/*" capture="environment" />
        <textarea placeholder="Describe the trash location..." />

        <button className="secondary-btn" onClick={getGPS}>
          📍 Get GPS Location
        </button>

        {coords && (
          <p className="coords">
            {coords.lat}, {coords.lng}
          </p>
        )}

        <button className="primary-btn">🚀 Submit</button>
      </div>
    </div>
  );
}
