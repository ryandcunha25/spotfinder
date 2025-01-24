// const apiKey = 'bcb5e3579f9346f598c35fd4c3742191';
// const response = await fetch(`https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(address)}&key=${apiKey}`);

import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

const ChangeMapView = ({ center, zoom }) => {
  const map = useMap();
  map.setView(center, zoom);
  return null;
};

const MyMapWithAddressSearch = ({address}) => {
  const [addresss, setAddress] = useState('');
  const [position, setPosition] = useState([51.505, -0.09]); // Default position (latitude, longitude)
  const [errorMessage, setErrorMessage] = useState('');
  const customIcon = L.icon({
    iconUrl: 'https://png.pngtree.com/png-vector/20210214/ourmid/pngtree-location-marker-png-image_2921053.jpg', // Replace with your custom icon's path
    iconSize: [38, 38], // Size of the icon
    iconAnchor: [19, 38], // Point of the icon that corresponds to the marker's location
    popupAnchor: [0, -30], // Point where the popup should open relative to the icon
  });

  const handleAddressChange = (e) => {
    setAddress(e.target.value);
  };

  const handleSearch = async () => {
    if (!address) {
      alert('Please enter an address.');
      return;
    }

    try {
      const apiKey = 'bcb5e3579f9346f598c35fd4c3742191';
      const response = await fetch(`https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(address)}&key=${apiKey}`);
      const data = await response.json();

      if (data.results && data.results.length > 0) {
        // You can refine this logic to better match specific address components
        const result = data.results[0]; // Selecting the first result (or refine selection)
        const { lat, lng } = result.geometry;
        const formattedAddress = result.formatted; // Address as returned by the API

        setPosition([lat, lng]); // Update map position
        setErrorMessage('');
        console.log('Matched Address:', formattedAddress); // Log or display the matched address
      } else {
        setErrorMessage('Address not found or no matching results. Please try another address.');
      }
    } catch (error) {
      console.error('Error fetching location data:', error);
      setErrorMessage('Error fetching location data. Please try again later.');
    }
  };


  return (
    <div style={{ padding: '20px' }}>
      <h2>Address Search</h2>
      <input
        type="text"
        placeholder="Enter address"
        value={address}
        onChange={handleAddressChange}
        style={{ padding: '10px', width: '300px' }}
      />
      <button onClick={handleSearch} style={{ marginLeft: '10px', padding: '10px' }}>
        Search
      </button>
      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
      <div style={{ height: '500px', marginTop: '20px' }}>
        <MapContainer center={position} zoom={13} style={{ height: '100%', width: '100%' }}>
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          <Marker position={position} icon={customIcon}>
            <Popup>
              You are here: {address || 'Default location'}
            </Popup>
          </Marker>
          {/* This component updates the view dynamically */}
          <ChangeMapView center={position} zoom={50} />
        </MapContainer>
      </div>
    </div>
  );
};

export default MyMapWithAddressSearch;
