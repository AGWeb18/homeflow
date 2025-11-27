import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icon in Leaflet with Webpack/Vite
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface MapPreviewProps {
  className?: string;
  isAnalyzed?: boolean;
}

// Component to update map center
const RecenterAutomatically = ({ lat, lng }: { lat: number; lng: number }) => {
  const map = useMap();
  useEffect(() => {
    map.flyTo([lat, lng], 16, { duration: 2 });
  }, [lat, lng, map]);
  return null;
};

const MapPreview: React.FC<MapPreviewProps> = ({ className, isAnalyzed }) => {
  // Default center (San Francisco)
  const [position, setPosition] = useState<[number, number]>([37.7749, -122.4194]);

  useEffect(() => {
    if (isAnalyzed) {
      // Simulate moving to a specific "found" address
      // In a real app, this would come from the geocoding result
      setPosition([37.7544, -122.4477]); // Twin Peaks area example
    }
  }, [isAnalyzed]);

  return (
    <div className={`relative overflow-hidden rounded-2xl shadow-2xl border border-slate-200 ${className}`}>
        <MapContainer 
          center={position} 
          zoom={13} 
          scrollWheelZoom={false} 
          style={{ height: '100%', width: '100%' }}
          zoomControl={false}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Marker position={position} />
          <RecenterAutomatically lat={position[0]} lng={position[1]} />
        </MapContainer>
        
        {/* Overlay Gradient for better text readability if we put text over it, 
            or just to make it look "premium" */}
        <div className="absolute inset-0 pointer-events-none border-2 border-white/20 rounded-2xl"></div>
    </div>
  );
};

export default MapPreview;