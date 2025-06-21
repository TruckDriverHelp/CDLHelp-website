import React from 'react';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';

import 'leaflet/dist/leaflet.css';
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css';
import 'leaflet-defaulticon-compatibility';

const SchoolMap = ({ lat, lon }) => {
    const position = [lat, lon];

    return (
        <MapContainer center={position} zoom={13} style={{ height: '100%', width: '100%' }}>
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            <Marker position={position}>
            </Marker>
        </MapContainer>
    );
};

export default SchoolMap; 