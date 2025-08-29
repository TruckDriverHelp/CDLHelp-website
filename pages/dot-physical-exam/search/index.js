import { useState, useEffect, useCallback, useRef } from 'react';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { GoogleMap, LoadScript, Marker, InfoWindow } from '@react-google-maps/api';
import { Container, Typography, TextField, Button, Box, Paper, Alert } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import Layout from '../../../components/_App/Layout';
import Navbar from '../../../components/_App/Navbar';
import Footer from '../../../components/_App/Footer';
import RelatedLinks from '../../../components/Common/RelatedLinks';
import { SEOHead } from '../../../src/shared/ui/SEO';
import { useSEO } from '../../../src/shared/lib/hooks/useSEO';
import { useRouter } from 'next/router';
import getMeta from '../../../lib/getMeta';

const containerStyle = {
  width: '100%',
  height: '500px',
};

const defaultCenter = {
  lat: 39.8283,
  lng: -98.5795,
};

const libraries = ['places'];

export default function DotPhysicalExam({ meta, alternateLinks }) {
  const { t } = useTranslation('common');
  const router = useRouter();
  const { locale } = router;

  const seoData = useSEO({
    meta: meta || {
      title: t('dotPhysicalExam.title'),
      description: t('dotPhysicalExam.description'),
    },
    customUrl: `https://www.cdlhelp.com${locale === 'en' ? '' : `/${locale}`}/dot-physical-exam/search`,
    type: 'website',
  });
  const [zipCode, setZipCode] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [mapCenter, setMapCenter] = useState(defaultCenter);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [error, setError] = useState(null);
  const [map, setMap] = useState(null);
  const markerRefs = useRef({});

  const onMapLoad = useCallback(map => {
    setMap(map);
  }, []);

  const searchNearbyLocations = useCallback(
    async (lat, lng) => {
      if (!map) return;

      setIsLoading(true);
      setError(null);
      try {
        const service = new window.google.maps.places.PlacesService(map);

        const request = {
          location: new window.google.maps.LatLng(lat, lng),
          radius: '50000',
          query: 'medical examiner dot physical',
        };

        const placesResult = await new Promise((resolve, reject) => {
          service.textSearch(request, (results, status) => {
            if (status === window.google.maps.places.PlacesServiceStatus.OK) {
              resolve(results);
            } else {
              reject(new Error(`Places search failed: ${status}`));
            }
          });
        });

        // Fetch detailed information for each place
        const detailedResults = await Promise.all(
          placesResult.map(
            place =>
              new Promise(resolve => {
                service.getDetails(
                  {
                    placeId: place.place_id,
                    fields: [
                      'name',
                      'formatted_address',
                      'geometry',
                      'rating',
                      'user_ratings_total',
                      'formatted_phone_number',
                    ],
                  },
                  (result, status) => {
                    if (status === window.google.maps.places.PlacesServiceStatus.OK) {
                      resolve(result);
                    } else {
                      resolve(place); // Fallback to original place data if details request fails
                    }
                  }
                );
              })
          )
        );

        setSearchResults(detailedResults);
      } catch (error) {
        // Error searching locations
        setError('An error occurred while searching. Please try again.');
        setSearchResults([]);
      } finally {
        setIsLoading(false);
      }
    },
    [map]
  );

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async position => {
          const { latitude, longitude } = position.coords;
          setMapCenter({ lat: latitude, lng: longitude });
          if (map) {
            map.setCenter({ lat: latitude, lng: longitude });
            await searchNearbyLocations(latitude, longitude);
          }
        },
        () => {
          // Location permission denied or error
        }
      );
    }
  }, [map, searchNearbyLocations]);

  const handleSearch = async () => {
    if (!zipCode || !map) return;

    setIsLoading(true);
    setError(null);
    try {
      const geocoder = new window.google.maps.Geocoder();

      const geocodeResult = await new Promise((resolve, reject) => {
        geocoder.geocode({ address: zipCode }, (results, status) => {
          if (status === 'OK') {
            resolve(results[0]);
          } else {
            reject(new Error('Geocoding failed'));
          }
        });
      });

      const location = geocodeResult.geometry.location;
      const lat = location.lat();
      const lng = location.lng();

      setMapCenter({ lat, lng });
      map.setCenter({ lat, lng });

      await searchNearbyLocations(lat, lng);
    } catch (error) {
      // Error searching locations
      setError('An error occurred while searching. Please try again.');
      setSearchResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = e => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleMarkerLoad = (marker, placeId, place) => {
    markerRefs.current[placeId] = marker;
    window.google.maps.event.clearListeners(marker, 'click');
    marker.addListener('click', () => {
      setSelectedPlace(place);
    });
  };

  return (
    <Layout>
      <SEOHead {...seoData} alternateLinks={alternateLinks} />
      <Navbar />

      <Container maxWidth="lg" sx={{ py: 4, paddingTop: '80px' }}>
        <Typography
          sx={{ margin: '60px 0' }}
          variant="h4"
          component="h1"
          align="center"
          gutterBottom
        >
          {t('dotPhysicalExam.title')}
        </Typography>

        <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
          <Typography variant="body1" align="center" sx={{ mb: 2 }}>
            {t('dotPhysicalExam.description')}
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, mb: 3, justifyContent: 'center' }}>
            <TextField
              sx={{ width: '150px' }}
              label={t('dotPhysicalExam.zipCodeLabel')}
              value={zipCode}
              onChange={e => setZipCode(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={t('dotPhysicalExam.zipCodePlaceholder')}
              variant="outlined"
              inputProps={{ maxLength: 5 }}
            />
            <Button
              variant="contained"
              onClick={handleSearch}
              disabled={isLoading}
              startIcon={<SearchIcon />}
            >
              {isLoading ? t('dotPhysicalExam.searchingButton') : t('dotPhysicalExam.searchButton')}
            </Button>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {t('dotPhysicalExam.error')}
            </Alert>
          )}

          <LoadScript
            googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}
            libraries={libraries}
          >
            <GoogleMap
              mapContainerStyle={containerStyle}
              center={mapCenter}
              zoom={12}
              onLoad={onMapLoad}
              disableDefaultUI={true}
            >
              {searchResults.map(place => (
                <Marker
                  key={place.place_id}
                  position={{
                    lat: place.geometry.location.lat(),
                    lng: place.geometry.location.lng(),
                  }}
                  title={place.name}
                  onLoad={marker => handleMarkerLoad(marker, place.place_id, place)}
                  options={{ clickable: true }}
                />
              ))}

              {selectedPlace && (
                <InfoWindow
                  position={{
                    lat: selectedPlace.geometry.location.lat(),
                    lng: selectedPlace.geometry.location.lng(),
                  }}
                  onCloseClick={() => setSelectedPlace(null)}
                  options={{
                    pixelOffset: new window.google.maps.Size(0, -30),
                  }}
                >
                  <Box sx={{ p: 1, maxWidth: 300 }}>
                    <Typography variant="subtitle1" fontWeight="bold">
                      {selectedPlace.name}
                    </Typography>
                    <Typography variant="body2">{selectedPlace.formatted_address}</Typography>
                    {selectedPlace.formatted_phone_number && (
                      <Typography variant="body2">
                        {t('dotPhysicalExam.phone')}: {selectedPlace.formatted_phone_number}
                      </Typography>
                    )}
                    {selectedPlace.rating && (
                      <Typography variant="body2" color="text.secondary">
                        {t('dotPhysicalExam.rating')}: {selectedPlace.rating} (
                        {selectedPlace.user_ratings_total} {t('dotPhysicalExam.reviews')})
                      </Typography>
                    )}
                  </Box>
                </InfoWindow>
              )}
            </GoogleMap>
          </LoadScript>
        </Paper>

        {searchResults.length > 0 && (
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h3" component="h2" gutterBottom>
              {t('dotPhysicalExam.nearbyLocations')}
            </Typography>
            {searchResults.map(place => (
              <Box
                key={place.place_id}
                sx={{
                  mb: 2,
                  p: 2,
                  cursor: 'pointer',
                  '&:hover': {
                    backgroundColor: 'rgba(0, 0, 0, 0.04)',
                  },
                }}
                onClick={() => setSelectedPlace(place)}
              >
                <Typography variant="h6">{place.name}</Typography>
                <Typography variant="body1">{place.formatted_address}</Typography>
                {place.formatted_phone_number && (
                  <Typography variant="body1">
                    {t('dotPhysicalExam.phone')}: {place.formatted_phone_number}
                  </Typography>
                )}
                {place.rating && (
                  <Typography variant="body2" color="text.secondary">
                    {t('dotPhysicalExam.rating')}: {place.rating} ({place.user_ratings_total}{' '}
                    {t('dotPhysicalExam.reviews')})
                  </Typography>
                )}
              </Box>
            ))}
          </Paper>
        )}
      </Container>

      <RelatedLinks currentPage="dot-physical-exam" />
      <Footer />
    </Layout>
  );
}

export async function getStaticProps({ locale }) {
  const meta = await getMeta(locale, 'general');

  const alternateLinks = {
    en: '/dot-physical-exam/search',
    ar: '/ar/dot-physical-exam/search',
    ru: '/ru/dot-physical-exam/search',
    uk: '/uk/dot-physical-exam/search',
    ko: '/ko/dot-physical-exam/search',
    zh: '/zh/dot-physical-exam/search',
    tr: '/tr/dot-physical-exam/search',
    pt: '/pt/dot-physical-exam/search',
  };

  return {
    props: {
      meta: meta,
      alternateLinks,
      ...(await serverSideTranslations(locale, ['common', 'navbar', 'footer', 'cookie'])),
    },
  };
}
