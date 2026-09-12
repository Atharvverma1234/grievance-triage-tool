import { useState } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';

// Leaflet's default marker icons break under Vite's bundling — point to CDN assets directly
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Default center: adjust to your city — this example uses Lucknow
const DEFAULT_CENTER = [26.8467, 80.9462];

function ClickHandler({ onPick }) {
  useMapEvents({
    click(e) {
      onPick(e.latlng);
    }
  });
  return null;
}

export default function LocationPicker({ onLocationChange }) {
  const [position, setPosition] = useState(null);

  const handlePick = (latlng) => {
    setPosition(latlng);
    onLocationChange({ lat: latlng.lat, lng: latlng.lng });
  };

  return (
    <div>
      <div style={{
        border: '1px solid var(--border)', borderRadius: 6, overflow: 'hidden', height: 320
      }}>
        <MapContainer center={DEFAULT_CENTER} zoom={13} style={{ height: '100%', width: '100%' }}>
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; OpenStreetMap contributors'
          />
          <ClickHandler onPick={handlePick} />
          {position && <Marker position={position} />}
        </MapContainer>
      </div>
      <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.4rem' }}>
        {position
          ? `Pinned: ${position.lat.toFixed(5)}, ${position.lng.toFixed(5)}`
          : 'Tap the map to pin the exact location'}
      </p>
    </div>
  );
}