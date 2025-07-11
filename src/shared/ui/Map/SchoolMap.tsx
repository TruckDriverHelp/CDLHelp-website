import React from 'react';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';

import 'leaflet/dist/leaflet.css';
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css';
import 'leaflet-defaulticon-compatibility';

interface SchoolMapProps {
  lat: number;
  lon: number;
}

const SchoolMap: React.FC<SchoolMapProps> = ({ lat, lon }) => {
  // Add client-side effect to confirm component is mounted
  React.useEffect(() => {}, [lat, lon]);

  // Validate coordinates
  if (!lat || !lon || isNaN(lat) || isNaN(lon)) {
    return (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#f0f0f0',
          color: '#6b7280',
        }}
      >
        <p>
          Invalid coordinates: lat={lat}, lon={lon}
        </p>
      </div>
    );
  }

  const position = [lat, lon];

  return (
    <MapContainer
      {...({ center: position } as any)}
      zoom={13}
      scrollWheelZoom={false}
      dragging={false}
      zoomControl={false}
      style={{ height: '100%', width: '100%' }}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <Marker {...({ position } as any)} />
    </MapContainer>
  );
};

export default SchoolMap;
