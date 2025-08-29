import { useState } from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import { Container, Typography, TextField, Button, Box, Paper } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { SchemaBuilder } from '../src/shared/ui/SEO/schemas';
import { StructuredData } from '../src/shared/ui/SEO/StructuredData';
import { useRouter } from 'next/router';
import { SEOHead } from '../src/shared/ui/SEO';
import { useSEO } from '../src/shared/lib/hooks/useSEO';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import getMeta from '../lib/getMeta';
import RelatedLinks from '../components/Common/RelatedLinks';

const containerStyle = {
  width: '100%',
  height: '500px',
};

const defaultCenter = {
  lat: 39.8283,
  lng: -98.5795,
};

export default function DotPhysicalExam({ meta, alternateLinks }) {
  const [zipCode, setZipCode] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [mapCenter, setMapCenter] = useState(defaultCenter);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const locale = router.locale || 'en';

  const seoData = useSEO({
    meta: meta || {
      title: 'DOT Physical Exam Locations | CDL Help',
      description:
        'Find DOT physical exam locations near you. Enter your zip code to locate certified medical examiners in your area.',
    },
    customUrl: `https://www.cdlhelp.com${locale === 'en' ? '' : `/${locale}`}/dot-physical-exam`,
    type: 'website',
  });

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
      image: 'http://localhost:3001/images/dot-physical-og.jpg',
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
      <SEOHead {...seoData} alternateLinks={alternateLinks} />
      <StructuredData data={schemas} />

      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography variant="h2" component="h1" gutterBottom>
          Find DOT Physical Exam Locations
        </Typography>

        {/* Comprehensive Information Section */}
        <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
          <Typography variant="h3" component="h2" gutterBottom>
            Complete Guide to DOT Physical Exams for CDL Drivers
          </Typography>

          <Typography variant="body1" paragraph>
            The Department of Transportation (DOT) physical exam is a mandatory medical examination
            required by the Federal Motor Carrier Safety Administration (FMCSA) for all commercial
            drivers. This comprehensive health assessment ensures that CDL drivers are physically
            and mentally capable of safely operating commercial vehicles on public roads.
          </Typography>

          <Typography variant="body1" paragraph>
            Whether you&apos;re a new CDL driver or renewing your medical certificate, understanding
            the DOT physical requirements and finding qualified medical examiners in your area is
            crucial for maintaining your commercial driving privileges. Our location finder tool
            helps you locate certified medical examiners near you who are authorized to perform DOT
            physical exams.
          </Typography>

          <Typography variant="h4" component="h3" sx={{ mt: 3, mb: 2 }}>
            What to Expect During Your DOT Physical
          </Typography>

          <Typography variant="body1" paragraph>
            A typical DOT physical exam includes several components designed to evaluate your
            overall health and fitness for commercial driving:
          </Typography>

          <Box component="ul" sx={{ pl: 4, mb: 3 }}>
            <Typography component="li" variant="body1" paragraph>
              <strong>Vision Test:</strong> You must have 20/40 vision or better in each eye (with
              or without correction) and at least 70-degree peripheral vision in both eyes.
            </Typography>
            <Typography component="li" variant="body1" paragraph>
              <strong>Hearing Test:</strong> You must be able to perceive a forced whisper at 5 feet
              or less, or pass an audiometric test.
            </Typography>
            <Typography component="li" variant="body1" paragraph>
              <strong>Blood Pressure Check:</strong> Your blood pressure must be below 140/90.
              Higher readings may require additional monitoring or treatment.
            </Typography>
            <Typography component="li" variant="body1" paragraph>
              <strong>Urinalysis:</strong> Tests for protein, blood, and sugar to screen for
              underlying health conditions.
            </Typography>
            <Typography component="li" variant="body1" paragraph>
              <strong>Physical Examination:</strong> Assessment of your heart, lungs, abdomen,
              spine, and extremities to ensure proper function.
            </Typography>
            <Typography component="li" variant="body1" paragraph>
              <strong>Medical History Review:</strong> Discussion of your medical history, current
              medications, and any ongoing health conditions.
            </Typography>
          </Box>

          <Typography variant="h4" component="h3" sx={{ mt: 3, mb: 2 }}>
            Medical Conditions That May Affect Your DOT Physical
          </Typography>

          <Typography variant="body1" paragraph>
            Several medical conditions can impact your ability to pass a DOT physical. Some
            conditions are automatically disqualifying, while others may require additional
            documentation or treatment:
          </Typography>

          <Box component="ul" sx={{ pl: 4, mb: 3 }}>
            <Typography component="li" variant="body1">
              Diabetes (especially insulin-dependent)
            </Typography>
            <Typography component="li" variant="body1">
              Sleep apnea
            </Typography>
            <Typography component="li" variant="body1">
              High blood pressure
            </Typography>
            <Typography component="li" variant="body1">
              Heart disease
            </Typography>
            <Typography component="li" variant="body1">
              Epilepsy or seizure disorders
            </Typography>
            <Typography component="li" variant="body1">
              Mental health conditions
            </Typography>
            <Typography component="li" variant="body1">
              Vision or hearing impairments
            </Typography>
            <Typography component="li" variant="body1">
              Substance abuse history
            </Typography>
          </Box>

          <Typography variant="h4" component="h3" sx={{ mt: 3, mb: 2 }}>
            Preparing for Your DOT Physical Exam
          </Typography>

          <Typography variant="body1" paragraph>
            Proper preparation can help ensure you pass your DOT physical on the first try:
          </Typography>

          <Box component="ol" sx={{ pl: 4, mb: 3 }}>
            <Typography component="li" variant="body1" paragraph>
              <strong>Gather Required Documents:</strong> Bring your current driver&apos;s license,
              a list of all medications, and any medical records related to ongoing conditions.
            </Typography>
            <Typography component="li" variant="body1" paragraph>
              <strong>Get a Good Night&apos;s Sleep:</strong> Being well-rested can help ensure
              accurate blood pressure readings and better overall performance.
            </Typography>
            <Typography component="li" variant="body1" paragraph>
              <strong>Bring Corrective Lenses:</strong> If you wear glasses or contacts, bring them
              to your exam and have a backup pair available.
            </Typography>
            <Typography component="li" variant="body1" paragraph>
              <strong>Manage Your Health:</strong> If you have ongoing medical conditions, ensure
              they are well-controlled before your exam.
            </Typography>
            <Typography component="li" variant="body1" paragraph>
              <strong>Stay Hydrated:</strong> Drink plenty of water before your exam to help with
              the urinalysis portion.
            </Typography>
          </Box>

          <Typography variant="h4" component="h3" sx={{ mt: 3, mb: 2 }}>
            DOT Physical Certification Periods
          </Typography>

          <Typography variant="body1" paragraph>
            The length of your DOT medical certificate depends on your health status:
          </Typography>

          <Box component="ul" sx={{ pl: 4, mb: 3 }}>
            <Typography component="li" variant="body1">
              <strong>2 Years:</strong> Standard certification for drivers in good health
            </Typography>
            <Typography component="li" variant="body1">
              <strong>1 Year:</strong> For drivers with certain controlled conditions like
              hypertension
            </Typography>
            <Typography component="li" variant="body1">
              <strong>3-6 Months:</strong> For drivers with conditions requiring frequent monitoring
            </Typography>
            <Typography component="li" variant="body1">
              <strong>Temporary:</strong> Short-term certificates while awaiting additional medical
              documentation
            </Typography>
          </Box>

          <Typography variant="h4" component="h3" sx={{ mt: 3, mb: 2 }}>
            Finding the Right Medical Examiner
          </Typography>

          <Typography variant="body1" paragraph>
            Only certified medical examiners listed on the FMCSA National Registry can perform DOT
            physical exams. Our search tool below helps you find qualified examiners in your area.
            When choosing an examiner, consider factors such as location, availability, cost, and
            reviews from other drivers.
          </Typography>

          <Typography variant="body1" paragraph>
            The cost of a DOT physical typically ranges from $50 to $150, depending on your location
            and the specific examiner. Some employers may cover the cost of your DOT physical, so be
            sure to check with your company&apos;s HR department.
          </Typography>
        </Paper>

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
      <RelatedLinks currentPage="dot-physical-exam" />
    </>
  );
}

export async function getStaticProps({ locale }) {
  const meta = await getMeta(locale, 'general');

  const alternateLinks = {
    en: '/dot-physical-exam',
    ar: '/ar/dot-physical-exam',
    ru: '/ru/dot-physical-exam',
    uk: '/uk/dot-physical-exam',
    ko: '/ko/dot-physical-exam',
    zh: '/zh/dot-physical-exam',
    tr: '/tr/dot-physical-exam',
    pt: '/pt/dot-physical-exam',
  };

  return {
    props: {
      meta: meta,
      alternateLinks,
      ...(await serverSideTranslations(locale ?? 'en', ['navbar', 'footer', 'cookie'])),
    },
  };
}
