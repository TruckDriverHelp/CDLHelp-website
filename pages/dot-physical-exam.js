import { useState } from 'react';
import Head from 'next/head';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import { Container, Typography, TextField, Button, Box, Paper } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { SchemaBuilder } from '../src/shared/ui/SEO/schemas';
import { StructuredData } from '../src/shared/ui/SEO/StructuredData';
import { useRouter } from 'next/router';

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
  const router = useRouter();
  const locale = router.locale || 'en';

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
    } finally {
      setIsLoading(false);
    }
  };

  // Build comprehensive schemas for DOT physical exam page
  const schemas = new SchemaBuilder(locale)
    .addOrganization({
      description: 'CDL Help - DOT physical exam locations and resources',
    })
    .addWebsite({
      description: 'Find DOT physical exam locations for CDL drivers',
    })
    .addBreadcrumb([
      { name: 'Home', url: '/' },
      { name: 'DOT Physical Exam', url: '/dot-physical-exam' },
    ])
    .addArticle({
      title: 'DOT Physical Exam Locations',
      description:
        'Find certified medical examiners for DOT physical exams near you. Complete guide to DOT physical requirements for CDL drivers.',
      content:
        'The DOT physical exam is required for all commercial drivers. Use our tool to find certified medical examiners in your area.',
      author: 'CDL Help Editorial Team',
      datePublished: '2023-01-01',
      dateModified: new Date().toISOString(),
      image: 'https://www.cdlhelp.com/images/dot-physical-og.jpg',
      url: `https://www.cdlhelp.com${locale === 'en' ? '' : `/${locale}`}/dot-physical-exam`,
      keywords: [
        'DOT physical',
        'CDL medical exam',
        'medical examiner',
        'DOT medical card',
        'CDL health requirements',
      ],
      articleSection: 'CDL Requirements',
      speakable: {
        '@type': 'SpeakableSpecification',
        cssSelector: ['h1', 'h2', '.exam-info'],
        xpath: ['/html/head/title', '/html/head/meta[@name="description"]/@content'],
      },
    })
    .addFAQ({
      questions: [
        {
          question: 'What is a DOT physical exam?',
          answer:
            'A DOT physical exam is a medical examination required by the Federal Motor Carrier Safety Administration (FMCSA) for commercial drivers to ensure they are physically qualified to safely operate a commercial vehicle.',
        },
        {
          question: 'How often do I need a DOT physical?',
          answer:
            'Most drivers need a DOT physical every 2 years. However, if you have certain medical conditions, you may need more frequent exams.',
        },
        {
          question: 'What should I bring to my DOT physical?',
          answer:
            'Bring your driver license, list of medications, glasses or contacts if you wear them, hearing aids if applicable, and any medical records related to ongoing conditions.',
        },
        {
          question: 'How much does a DOT physical cost?',
          answer:
            'DOT physical exams typically cost between $50-$150, depending on your location and the provider.',
        },
        {
          question: 'Can I fail a DOT physical?',
          answer:
            'Yes, you can be disqualified if you have certain medical conditions that make it unsafe for you to operate a commercial vehicle.',
        },
      ],
    })
    .addOrganization({
      type: 'MedicalBusiness',
      name: 'DOT Physical Exam Centers',
      description: 'Network of certified medical examiners for DOT physicals',
    })
    .build();

  return (
    <>
      <Head>
        <title>DOT Physical Exam Locations | CDL Help</title>
        <meta
          name="description"
          content="Find DOT physical exam locations near you. Enter your zip code to locate certified medical examiners in your area."
        />
      </Head>

      {/* Structured Data Schemas */}
      <StructuredData data={schemas} />

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
