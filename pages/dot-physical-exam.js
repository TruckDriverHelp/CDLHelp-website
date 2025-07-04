import { useState } from 'react';
import Head from 'next/head';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import { Container, Typography, TextField, Button, Box, Paper } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

const containerStyle = {
  width: '100%',
  height: '500px',
};

const defaultCenter = {
  lat: 39.8283,
  lng: -98.5795,
};

export default function DotPhysicalExam() {
  const [zipCode, setZipCode] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [mapCenter, setMapCenter] = useState(defaultCenter);
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = async () => {
    if (!zipCode) return;

    setIsLoading(true);
    try {
      // Convert zip code to coordinates using Google Geocoding API
      const geocodeResponse = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${zipCode}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`
      );
      const geocodeData = await geocodeResponse.json();

      if (geocodeData.results && geocodeData.results[0]) {
        const { lat, lng } = geocodeData.results[0].geometry.location;
        setMapCenter({ lat, lng });

        // Use the new Place API for searching
        const placesResponse = await fetch(`https://places.googleapis.com/v1/places:searchText`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Goog-Api-Key': process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
            'X-Goog-FieldMask':
              'places.displayName,places.formattedAddress,places.location,places.rating,places.userRatingCount',
          },
          body: JSON.stringify({
            textQuery: `dot physical ${zipCode}`,
            locationBias: {
              circle: {
                center: { latitude: lat, longitude: lng },
                radius: 50000, // 50km radius
              },
            },
          }),
        });
        const placesData = await placesResponse.json();

        if (placesData.places) {
          setSearchResults(
            placesData.places.map(place => ({
              place_id: place.id,
              name: place.displayName.text,
              formatted_address: place.formattedAddress,
              geometry: {
                location: {
                  lat: place.location.latitude,
                  lng: place.location.longitude,
                },
              },
              rating: place.rating,
              user_ratings_total: place.userRatingCount,
            }))
          );
        }
      }
    } catch (error) {
      console.error('Error searching locations:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>DOT Physical Exam Locations | CDL Help</title>
        <meta
          name="description"
          content="Find DOT physical exam locations near you. Enter your zip code to locate certified medical examiners in your area."
        />
      </Head>

      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography variant="h2" component="h1" gutterBottom>
          Find DOT Physical Exam Locations
        </Typography>

        <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
          <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
            <TextField
              fullWidth
              label="Enter Zip Code"
              value={zipCode}
              onChange={e => setZipCode(e.target.value)}
              placeholder="e.g., 12345"
              variant="outlined"
            />
            <Button
              variant="contained"
              onClick={handleSearch}
              disabled={isLoading}
              startIcon={<SearchIcon />}
            >
              Search
            </Button>
          </Box>

          <LoadScript googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}>
            <GoogleMap mapContainerStyle={containerStyle} center={mapCenter} zoom={12}>
              {searchResults.map(place => (
                <Marker
                  key={place.place_id}
                  position={{
                    lat: place.geometry.location.lat,
                    lng: place.geometry.location.lng,
                  }}
                  title={place.name}
                />
              ))}
            </GoogleMap>
          </LoadScript>
        </Paper>

        {searchResults.length > 0 && (
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h3" component="h2" gutterBottom>
              Nearby Locations
            </Typography>
            {searchResults.map(place => (
              <Box key={place.place_id} sx={{ mb: 2 }}>
                <Typography variant="h6">{place.name}</Typography>
                <Typography variant="body1">{place.formatted_address}</Typography>
                {place.rating && (
                  <Typography variant="body2" color="text.secondary">
                    Rating: {place.rating} ({place.user_ratings_total} reviews)
                  </Typography>
                )}
              </Box>
            ))}
          </Paper>
        )}
      </Container>
    </>
  );
}
