import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet.heat';

const DEFAULT_CENTER = [26.8467, 80.9462]; // adjust to your city

export default function ComplaintHeatmap({ complaints }) {
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const heatLayer = useRef(null);

  useEffect(() => {
    if (!mapInstance.current) {
      mapInstance.current = L.map(mapRef.current).setView(DEFAULT_CENTER, 12);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
      }).addTo(mapInstance.current);
    }

    const points = complaints
      .filter(c => c.locationLat && c.locationLng)
      .map(c => [c.locationLat, c.locationLng, 0.6]);

    if (heatLayer.current) {
      mapInstance.current.removeLayer(heatLayer.current);
    }
    if (points.length > 0) {
      heatLayer.current = L.heatLayer(points, { radius: 28, blur: 20, maxZoom: 15 }).addTo(mapInstance.current);
    }

    return () => {
      // cleanup handled on next effect run / unmount below
    };
  }, [complaints]);

  useEffect(() => {
    return () => {
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
      }
    };
  }, []);

  return <div ref={mapRef} style={{ height: 320, borderRadius: 8, overflow: 'hidden', border: '1px solid var(--border)' }} />;
}