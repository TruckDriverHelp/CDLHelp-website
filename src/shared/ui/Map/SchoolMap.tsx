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