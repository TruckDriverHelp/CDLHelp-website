import React from 'react';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import Link from 'next/link';
import dynamic from 'next/dynamic';

import Layout from '../../components/_App/Layout';
import Navbar from '../../components/_App/Navbar';
import Footer from '../../components/_App/Footer';
import PageBannerStyle1 from '../../components/Common/PageBannerStyle1';
import { formatStateName } from '../../src/shared/lib/utils/formatters';
import { SchoolList } from '../../src/widgets/SchoolList';
import { SEOHead } from '../../src/shared/ui/SEO';
import { useSEO } from '../../src/shared/lib/hooks/useSEO';
import getMeta from '../../lib/getMeta';

const SchoolMap = dynamic(
  () => {
    console.log('[Dynamic Import] Loading SchoolMap component...');
    return import('../../src/shared/ui/Map/SchoolMap')
      .then(module => {
        console.log('[Dynamic Import] SchoolMap loaded successfully');
        return module;
      })
      .catch(error => {
        console.error('[Dynamic Import] Failed to load SchoolMap:', error);
        throw error;
      });
  },
  {
    ssr: false,
    loading: () => {
      console.log('[SchoolMap] Loading component...');
      return (
        <div
          style={{
            height: '100%',
            background: '#f0f0f0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          Loading map...
        </div>
      );
    },
  }
);

// Component for City page (showing schools)
const CitySchoolsPage = ({ schools, state, city, meta }) => {
  const { t } = useTranslation(['city-schools', 'index']);
  const router = useRouter();
  const { locale } = router;

  const stateFormatted = formatStateName(state);
  const cityFormatted = city.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());

  const seoData = useSEO({
    meta,
    customUrl: `https://www.cdlhelp.com/schools/${state}/${city}`,
    type: 'article',
  });

  return (
    <>
      <SEOHead {...seoData} />

      <Layout alternateLinks={{}} dir="ltr">
        <Navbar alternateLinks={{}} />

        <PageBannerStyle1
          pageTitle={t('schoolsInCity', {
            city: cityFormatted,
            state: stateFormatted,
            defaultValue: `Schools in ${cityFormatted}, ${stateFormatted}`,
          })}
          homePageUrl="/schools"
          homePageText={t('schoolsTitle', 'Schools')}
          activePageText={`${cityFormatted}, ${stateFormatted}`}
        />

        <div
          style={{
            backgroundColor: '#f8fafc',
            minHeight: 'calc(100vh - 200px)',
            paddingBottom: '100px',
          }}
        >
          <div
            style={{
              maxWidth: '100%',
              padding: '0 20px',
            }}
          >
            {/* Breadcrumb */}
            <div
              style={{
                padding: '20px 0',
                maxWidth: '1400px',
                margin: '0 auto',
              }}
            >
              <nav
                style={{
                  fontSize: '14px',
                  color: '#6b7280',
                }}
              >
                <Link href="/schools" locale={locale} legacyBehavior>
                  <a style={{ color: '#3c3d78', textDecoration: 'none' }}>
                    {t('schoolsTitle', 'Schools')}
                  </a>
                </Link>
                <span style={{ margin: '0 8px' }}>›</span>
                <Link href={`/schools/${state}`} locale={locale} legacyBehavior>
                  <a style={{ color: '#3c3d78', textDecoration: 'none' }}>{stateFormatted}</a>
                </Link>
                <span style={{ margin: '0 8px' }}>›</span>
                <span>{cityFormatted}</span>
              </nav>
            </div>

            {/* Schools Grid */}
            <div
              className="schools-grid"
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
                gap: '24px',
                padding: '20px 0',
                maxWidth: '1400px',
                margin: '0 auto',
              }}
            >
              {schools.map(schoolLocation => (
                <div key={schoolLocation.id}>
                  <SchoolList schools={[schoolLocation]} loading={false} error={null} />
                </div>
              ))}
            </div>

            {schools.length === 0 && (
              <div
                style={{
                  textAlign: 'center',
                  padding: '60px 20px',
                  background: '#fff',
                  borderRadius: '16px',
                  margin: '40px auto',
                  maxWidth: '600px',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                }}
              >
                <h3
                  style={{
                    fontSize: '1.5rem',
                    color: '#374151',
                    marginBottom: '12px',
                  }}
                >
                  {t('noSchoolsTitle', 'No Schools Found')}
                </h3>
                <p
                  style={{
                    color: '#6b7280',
                    fontSize: '1rem',
                  }}
                >
                  {t('noSchoolsInCity', {
                    city: cityFormatted,
                    state: stateFormatted,
                    defaultValue: `No CDL schools are currently available in ${cityFormatted}, ${stateFormatted}.`,
                  })}
                </p>
              </div>
            )}
          </div>
        </div>

        <Footer />
      </Layout>

      <style jsx>{`
        @media (max-width: 768px) {
          .schools-grid {
            grid-template-columns: 1fr !important;
            gap: 16px !important;
            padding: 0 10px !important;
          }
        }
      `}</style>
    </>
  );
};

// Component for State page (showing cities)
const StateCitiesPage = ({ cities, state, meta }) => {
  const { t } = useTranslation(['city-schools', 'index']);
  const stateFormatted = formatStateName(state);

  const seoData = useSEO({
    meta,
    customUrl: `https://www.cdlhelp.com/schools/${state}`,
    type: 'article',
  });

  const cardStyle = {
    backgroundColor: '#fff',
    padding: '20px',
    borderRadius: '12px',
    border: '1px solid #e1e5e9',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    cursor: 'pointer',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
  };

  const linkStyle = {
    textDecoration: 'none',
    textAlign: 'center',
    color: '#1f2937',
    fontWeight: '600',
    fontSize: '16px',
  };

  const countStyle = {
    backgroundColor: '#3c3d78',
    color: 'white',
    padding: '6px 12px',
    borderRadius: '20px',
    fontSize: '13px',
    fontWeight: '600',
  };

  return (
    <>
      <SEOHead {...seoData} />

      <Layout alternateLinks={{}} dir="ltr">
        <Navbar alternateLinks={{}} />

        <PageBannerStyle1
          pageTitle={t('citiesInState', {
            state: stateFormatted,
            defaultValue: `Schools in ${stateFormatted}`,
          })}
          homePageUrl="/schools"
          homePageText={t('schoolsTitle', 'Schools')}
          activePageText={stateFormatted}
        />

        <div
          style={{
            backgroundColor: '#f8fafc',
            minHeight: 'calc(100vh - 200px)',
            paddingBottom: '100px',
          }}
        >
          <div className="container">
            <div
              style={{
                textAlign: 'center',
                marginTop: '40px',
                marginBottom: '40px',
              }}
            >
              <h2
                style={{
                  fontSize: '2rem',
                  fontWeight: '600',
                  color: '#1a1a1a',
                  marginBottom: '12px',
                }}
              >
                {t('selectCity', { defaultValue: 'Select a City' })}
              </h2>
              <p
                style={{
                  color: '#6b7280',
                  fontSize: '1rem',
                }}
              >
                {t('selectCityDescription', {
                  state: stateFormatted,
                  defaultValue: `Choose a city in ${stateFormatted} to view CDL schools`,
                })}
              </p>
            </div>

            {/* Cities Grid */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                gap: '16px',
                maxWidth: '900px',
                margin: '0 auto',
              }}
            >
              {cities.map(city => (
                <Link key={city.slug} href={`/schools/${state}/${city.slug}`}>
                  <div
                    style={cardStyle}
                    onMouseEnter={e => {
                      e.currentTarget.style.transform = 'translateY(-2px)';
                      e.currentTarget.style.boxShadow = '0 8px 16px rgba(0,0,0,0.12)';
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.05)';
                    }}
                  >
                    <span style={linkStyle}>{city.name}</span>
                    {city.schoolCount && <span style={countStyle}>{city.schoolCount}</span>}
                  </div>
                </Link>
              ))}
            </div>

            {cities.length === 0 && (
              <div
                style={{
                  textAlign: 'center',
                  padding: '60px 20px',
                  background: '#fff',
                  borderRadius: '16px',
                  margin: '40px auto',
                  maxWidth: '600px',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                }}
              >
                <h3
                  style={{
                    fontSize: '1.5rem',
                    color: '#374151',
                    marginBottom: '12px',
                  }}
                >
                  {t('noCitiesTitle', { defaultValue: 'No Cities Found' })}
                </h3>
                <p
                  style={{
                    color: '#6b7280',
                    fontSize: '1rem',
                  }}
                >
                  {t('noCitiesText', {
                    state: stateFormatted,
                    defaultValue: `No cities with CDL schools are currently available in ${stateFormatted}.`,
                  })}
                </p>
              </div>
            )}
          </div>
        </div>

        <Footer />
      </Layout>

      <style jsx>{`
        @media (max-width: 768px) {
          .cities-grid {
            grid-template-columns: 1fr !important;
            gap: 16px !important;
            padding: 0 10px !important;
          }
        }
      `}</style>
    </>
  );
};

// Component for School Profile page
const SchoolProfilePage = ({ school, otherSchools, meta }) => {
  const { t } = useTranslation(['school-profile', 'index']);
  const router = useRouter();
  const { locale } = router;

  // Client-side debug logging
  React.useEffect(() => {
    console.log('[SchoolProfile CLIENT] Component mounted with data:', {
      school,
      attributes: school?.attributes,
      locations: school?.locations,
      coords: school?.attributes?.coords,
    });
  }, [school]);

  // Debug logging
  console.log('[SchoolProfile] Rendering with school data:', {
    school,
    attributes: school?.attributes,
    locations: school?.locations,
  });

  const { state, city } = school?.attributes || {};
  const stateFormatted = state ? formatStateName(state) : '';
  const cityFormatted = city ? city.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) : '';

  const schoolData = school?.locations?.data?.[0]?.attributes || {};
  const schoolName = schoolData.Name || 'CDL School';

  // Extract location data - this is the school_location data
  const locationData = school?.attributes || {};
  const { Address, phone_number, coords, zip } = locationData;

  // Also check if coordinates might be in the school data itself
  const schoolCoords = schoolData?.coords;

  console.log('[SchoolProfile] Location data sources:', {
    locationData,
    schoolLocationCoords: coords,
    schoolDataCoords: schoolCoords,
    schoolLocations: school?.attributes?.school_locations,
  });

  const lat = coords?.latitude || schoolCoords?.latitude;
  const lon = coords?.longitude || schoolCoords?.longitude;

  console.log('[SchoolProfile] Coordinates:', {
    coords,
    lat,
    lon,
    latType: typeof lat,
    lonType: typeof lon,
    hasCoords: !!(lat && lon),
  });

  const seoData = useSEO({
    meta,
    customUrl: `https://www.cdlhelp.com/schools/${router.query.params?.[0]}`,
    type: 'article',
  });

  const formatPhoneNumber = phone => {
    if (!phone) return '';
    const cleaned = phone.replace(/\D/g, '');
    const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
    if (match) {
      return `(${match[1]}) ${match[2]}-${match[3]}`;
    }
    return phone;
  };

  return (
    <>
      <SEOHead {...seoData} />

      <Layout alternateLinks={{}} dir="ltr">
        <Navbar alternateLinks={{}} />

        <PageBannerStyle1
          pageTitle={`${schoolName} - CDL Training`}
          homePageUrl="/schools"
          homePageText={t('schoolsTitle', 'CDL Schools')}
          activePageText={schoolName}
        />

        <div
          style={{
            backgroundColor: '#f8fafc',
            minHeight: 'calc(100vh - 200px)',
            paddingBottom: '100px',
          }}
        >
          <div
            style={{
              maxWidth: '1200px',
              margin: '0 auto',
              padding: '0 20px',
            }}
          >
            {/* Breadcrumb */}
            <div
              style={{
                padding: '20px 0',
              }}
            >
              <nav
                style={{
                  fontSize: '14px',
                  color: '#6b7280',
                }}
              >
                <Link href="/schools" locale={locale} legacyBehavior>
                  <a style={{ color: '#3c3d78', textDecoration: 'none' }}>
                    {t('schoolsTitle', 'Schools')}
                  </a>
                </Link>
                <span style={{ margin: '0 8px' }}>›</span>
                <Link
                  href={`/schools/${state?.toLowerCase().replace(/_/g, '-')}`}
                  locale={locale}
                  legacyBehavior
                >
                  <a style={{ color: '#3c3d78', textDecoration: 'none' }}>{stateFormatted}</a>
                </Link>
                <span style={{ margin: '0 8px' }}>›</span>
                <Link
                  href={`/schools/${state?.toLowerCase().replace(/_/g, '-')}/${city?.toLowerCase()}`}
                  locale={locale}
                  legacyBehavior
                >
                  <a style={{ color: '#3c3d78', textDecoration: 'none' }}>{cityFormatted}</a>
                </Link>
                <span style={{ margin: '0 8px' }}>›</span>
                <span>{schoolName}</span>
              </nav>
            </div>

            {/* School Info Container */}
            <div
              style={{
                backgroundColor: '#fff',
                borderRadius: '16px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                overflow: 'hidden',
              }}
            >
              {/* Map Section */}
              <div
                style={{
                  width: '100%',
                  height: '400px',
                  position: 'relative',
                }}
              >
                {(() => {
                  console.log('[SchoolProfile] Map render check:', {
                    lat,
                    lon,
                    condition: !!(lat && lon),
                    parsedLat: lat ? parseFloat(String(lat)) : null,
                    parsedLon: lon ? parseFloat(String(lon)) : null,
                  });

                  if (lat && lon) {
                    const parsedLat = parseFloat(String(lat));
                    const parsedLon = parseFloat(String(lon));
                    console.log('[SchoolProfile] Rendering SchoolMap with:', {
                      parsedLat,
                      parsedLon,
                    });

                    // Add key to force re-render on coordinate change
                    return (
                      <SchoolMap
                        key={`${parsedLat}-${parsedLon}`}
                        lat={parsedLat}
                        lon={parsedLon}
                      />
                    );
                  } else {
                    console.log('[SchoolProfile] Not rendering map - missing coordinates');
                    return (
                      <div
                        style={{
                          width: '100%',
                          height: '100%',
                          backgroundColor: '#f0f0f0',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#6b7280',
                        }}
                      >
                        <p>{t('mapNotAvailable', 'Map not available - No coordinates')}</p>
                      </div>
                    );
                  }
                })()}
              </div>

              {/* School Information */}
              <div style={{ padding: '40px' }}>
                <h1
                  style={{
                    fontSize: '2rem',
                    marginBottom: '24px',
                    color: '#1a1a1a',
                    fontWeight: '600',
                  }}
                >
                  {schoolName}
                </h1>

                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                    gap: '32px',
                  }}
                >
                  {/* Contact Information */}
                  <div>
                    <h2
                      style={{
                        fontSize: '1.25rem',
                        marginBottom: '16px',
                        color: '#374151',
                        fontWeight: '600',
                      }}
                    >
                      {t('contactInfo', 'Contact Information')}
                    </h2>

                    <div style={{ marginBottom: '16px' }}>
                      <p style={{ color: '#6b7280', marginBottom: '4px' }}>
                        {t('address', 'Address')}:
                      </p>
                      <p style={{ color: '#1a1a1a', fontWeight: '500' }}>
                        {Address || 'N/A'}
                        <br />
                        {cityFormatted}, {stateFormatted} {zip || ''}
                      </p>
                    </div>

                    {phone_number && (
                      <div style={{ marginBottom: '16px' }}>
                        <p style={{ color: '#6b7280', marginBottom: '4px' }}>
                          {t('phone', 'Phone')}:
                        </p>
                        <a
                          href={`tel:${phone_number}`}
                          style={{
                            color: '#3c3d78',
                            fontWeight: '500',
                            textDecoration: 'none',
                          }}
                        >
                          {formatPhoneNumber(phone_number)}
                        </a>
                      </div>
                    )}
                  </div>

                  {/* Additional Information */}
                  <div>
                    <h2
                      style={{
                        fontSize: '1.25rem',
                        marginBottom: '16px',
                        color: '#374151',
                        fontWeight: '600',
                      }}
                    >
                      {t('aboutSchool', 'About This School')}
                    </h2>
                    {schoolData.description ? (
                      <p style={{ color: '#6b7280', lineHeight: '1.6', marginBottom: '20px' }}>
                        {schoolData.description}
                      </p>
                    ) : (
                      <p style={{ color: '#6b7280', lineHeight: '1.6' }}>
                        {t('schoolDescription', {
                          schoolName,
                          city: cityFormatted,
                          state: stateFormatted,
                          defaultValue: `${schoolName} is a CDL training school located in ${cityFormatted}, ${stateFormatted}. Contact them directly for more information about their CDL training programs, schedules, and pricing.`,
                        })}
                      </p>
                    )}

                    {/* Website */}
                    {schoolData.website && (
                      <div style={{ marginBottom: '16px' }}>
                        <p style={{ color: '#6b7280', marginBottom: '4px' }}>
                          {t('website', 'Website')}:
                        </p>
                        <a
                          href={schoolData.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            color: '#3c3d78',
                            fontWeight: '500',
                            textDecoration: 'none',
                          }}
                        >
                          {schoolData.website}
                        </a>
                      </div>
                    )}

                    {/* Email */}
                    {schoolData.email && (
                      <div style={{ marginBottom: '16px' }}>
                        <p style={{ color: '#6b7280', marginBottom: '4px' }}>
                          {t('email', 'Email')}:
                        </p>
                        <a
                          href={`mailto:${schoolData.email}`}
                          style={{
                            color: '#3c3d78',
                            fontWeight: '500',
                            textDecoration: 'none',
                          }}
                        >
                          {schoolData.email}
                        </a>
                      </div>
                    )}

                    {/* Operating Hours */}
                    {schoolData.operating_hours && (
                      <div style={{ marginBottom: '16px' }}>
                        <p style={{ color: '#6b7280', marginBottom: '4px' }}>
                          {t('operatingHours', 'Operating Hours')}:
                        </p>
                        <p style={{ color: '#1a1a1a', fontWeight: '500' }}>
                          {schoolData.operating_hours}
                        </p>
                      </div>
                    )}

                    {/* Languages Spoken */}
                    {schoolData.languages_spoken && (
                      <div style={{ marginBottom: '16px' }}>
                        <p style={{ color: '#6b7280', marginBottom: '4px' }}>
                          {t('languagesSpoken', 'Languages Spoken')}:
                        </p>
                        <p style={{ color: '#1a1a1a', fontWeight: '500' }}>
                          {schoolData.languages_spoken}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Program Details Section */}
                {(schoolData.services_offered ||
                  schoolData.certifications ||
                  schoolData.tuition_cost ||
                  schoolData.average_completion_time ||
                  schoolData.success_rate ||
                  schoolData.fleet_size ||
                  schoolData.instructor_count ||
                  schoolData.student_capacity) && (
                  <div style={{ marginTop: '40px' }}>
                    <h2
                      style={{
                        fontSize: '1.25rem',
                        marginBottom: '20px',
                        color: '#374151',
                        fontWeight: '600',
                      }}
                    >
                      {t('programDetails', 'Program Details')}
                    </h2>

                    <div
                      style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                        gap: '24px',
                      }}
                    >
                      {/* Services Offered */}
                      {schoolData.services_offered && (
                        <div>
                          <h3
                            style={{ color: '#6b7280', fontSize: '0.875rem', marginBottom: '8px' }}
                          >
                            {t('servicesOffered', 'Services Offered')}
                          </h3>
                          <p style={{ color: '#1a1a1a', fontSize: '1rem' }}>
                            {schoolData.services_offered}
                          </p>
                        </div>
                      )}

                      {/* Certifications */}
                      {schoolData.certifications && (
                        <div>
                          <h3
                            style={{ color: '#6b7280', fontSize: '0.875rem', marginBottom: '8px' }}
                          >
                            {t('certifications', 'Certifications')}
                          </h3>
                          <p style={{ color: '#1a1a1a', fontSize: '1rem' }}>
                            {schoolData.certifications}
                          </p>
                        </div>
                      )}

                      {/* Other fields... */}
                    </div>
                  </div>
                )}

                {/* What is Taught at CDL Schools */}
                <div style={{ marginTop: '40px' }}>
                  <h2
                    style={{
                      fontSize: '1.5rem',
                      marginBottom: '20px',
                      color: '#1a1a1a',
                      fontWeight: '600',
                    }}
                  >
                    {t('whatIsTaught', 'What is Taught at CDL Schools')}
                  </h2>
                  <p style={{ color: '#6b7280', lineHeight: '1.8' }}>
                    {t(
                      'cdlCurriculumParagraph',
                      "CDL schools provide comprehensive training to prepare students for their Commercial Driver's License exam. The curriculum covers essential topics including pre-trip vehicle inspection procedures, basic vehicle control and maneuvering, on-road driving skills and safety, federal and state regulations, Hours of Service (HOS) rules, cargo handling and documentation, trip planning and navigation, and hazardous materials handling for those seeking HazMat endorsement. Training is delivered through a combination of classroom instruction, hands-on practice, and real-world driving experience, with programs typically ranging from a few weeks to several months."
                    )}
                  </p>
                </div>
              </div>
            </div>

            {/* Other Schools in Same State */}
            {otherSchools && otherSchools.length > 0 && (
              <div
                style={{
                  marginTop: '40px',
                  backgroundColor: '#fff',
                  borderRadius: '16px',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                  padding: '40px',
                }}
              >
                <h2
                  style={{
                    fontSize: '1.5rem',
                    marginBottom: '20px',
                    color: '#1a1a1a',
                    fontWeight: '600',
                  }}
                >
                  {t('otherSchoolsInState', `Other CDL Schools in ${stateFormatted}`)}
                </h2>
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                    gap: '20px',
                  }}
                >
                  {otherSchools.map(otherSchool => {
                    const otherSchoolName =
                      otherSchool.locations?.data?.[0]?.attributes?.Name || 'CDL School';
                    const otherCity = otherSchool.attributes?.city || '';
                    const otherCityFormatted = otherCity
                      .replace(/-/g, ' ')
                      .replace(/\b\w/g, l => l.toUpperCase());
                    const otherSchoolSlug = otherSchoolName
                      .toLowerCase()
                      .replace(/[^a-z0-9]+/g, '-')
                      .replace(/(^-|-$)/g, '');

                    return (
                      <Link
                        key={otherSchool.id}
                        href={`/schools/${otherSchoolSlug}`}
                        locale={locale}
                        legacyBehavior
                      >
                        <a
                          style={{
                            display: 'block',
                            padding: '24px',
                            backgroundColor: '#f9fafb',
                            border: '1px solid #e5e7eb',
                            borderRadius: '12px',
                            textDecoration: 'none',
                            transition: 'all 0.3s ease',
                          }}
                          onMouseEnter={e => {
                            e.currentTarget.style.borderColor = '#3c3d78';
                            e.currentTarget.style.boxShadow = '0 4px 12px rgba(60,61,120,0.15)';
                          }}
                          onMouseLeave={e => {
                            e.currentTarget.style.borderColor = '#e5e7eb';
                            e.currentTarget.style.boxShadow = 'none';
                          }}
                        >
                          <h3
                            style={{
                              color: '#1a1a1a',
                              fontSize: '1.125rem',
                              marginBottom: '8px',
                              fontWeight: '600',
                            }}
                          >
                            {otherSchoolName}
                          </h3>
                          <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>
                            {otherCityFormatted}, {stateFormatted}
                          </p>
                          {otherSchool.attributes?.phone_number && (
                            <p style={{ color: '#3c3d78', fontSize: '0.875rem', marginTop: '8px' }}>
                              {formatPhoneNumber(otherSchool.attributes.phone_number)}
                            </p>
                          )}
                        </a>
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Helpful Resources Section - Now in separate container */}
            <div
              style={{
                marginTop: '40px',
                backgroundColor: '#fff',
                borderRadius: '16px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                padding: '40px',
              }}
            >
              <h2
                style={{
                  fontSize: '1.5rem',
                  marginBottom: '20px',
                  color: '#1a1a1a',
                  fontWeight: '600',
                }}
              >
                {t('helpfulResources', 'Helpful Resources')}
              </h2>
              <div
                className="resources-grid"
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(4, 1fr)',
                  gap: '20px',
                }}
              >
                {/* Pre-trip Inspection Card */}
                <Link href="/pre-trip-inspection" locale={locale} legacyBehavior>
                  <a
                    style={{
                      display: 'block',
                      padding: '24px',
                      backgroundColor: '#fff',
                      border: '2px solid #e5e7eb',
                      borderRadius: '12px',
                      textDecoration: 'none',
                      transition: 'all 0.3s ease',
                      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.borderColor = '#3c3d78';
                      e.currentTarget.style.boxShadow = '0 4px 12px rgba(60,61,120,0.15)';
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.borderColor = '#e5e7eb';
                      e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)';
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '12px' }}>
                      <i
                        className="ri-truck-line"
                        style={{ fontSize: '24px', color: '#3c3d78', marginRight: '12px' }}
                      ></i>
                      <h3 style={{ color: '#1a1a1a', fontSize: '1.125rem', margin: 0 }}>
                        {t('preTrip', 'Pre-Trip Inspection')}
                      </h3>
                    </div>
                    <p style={{ color: '#6b7280', fontSize: '0.875rem', margin: 0 }}>
                      {t(
                        'preTripDesc',
                        'Learn the complete pre-trip inspection process required for your CDL test'
                      )}
                    </p>
                  </a>
                </Link>

                {/* English for Truck Drivers Card */}
                <Link href="/articles/english-for-truck-drivers" locale={locale} legacyBehavior>
                  <a
                    style={{
                      display: 'block',
                      padding: '24px',
                      backgroundColor: '#fff',
                      border: '2px solid #e5e7eb',
                      borderRadius: '12px',
                      textDecoration: 'none',
                      transition: 'all 0.3s ease',
                      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.borderColor = '#3c3d78';
                      e.currentTarget.style.boxShadow = '0 4px 12px rgba(60,61,120,0.15)';
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.borderColor = '#e5e7eb';
                      e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)';
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '12px' }}>
                      <i
                        className="ri-translate"
                        style={{ fontSize: '24px', color: '#3c3d78', marginRight: '12px' }}
                      ></i>
                      <h3 style={{ color: '#1a1a1a', fontSize: '1.125rem', margin: 0 }}>
                        {t('englishForDrivers', 'English for Truck Drivers')}
                      </h3>
                    </div>
                    <p style={{ color: '#6b7280', fontSize: '0.875rem', margin: 0 }}>
                      {t(
                        'englishDesc',
                        'Essential English vocabulary and phrases for professional truck drivers'
                      )}
                    </p>
                  </a>
                </Link>

                {/* CDL Curriculum Card */}
                <Link
                  href={
                    locale === 'en'
                      ? '/articles/what-is-taught-in-cdl-schools'
                      : `/${locale}/articles/chto-prepodayut-v-shkolakh-cdl`
                  }
                  locale={locale}
                  legacyBehavior
                >
                  <a
                    style={{
                      display: 'block',
                      padding: '24px',
                      backgroundColor: '#fff',
                      border: '2px solid #e5e7eb',
                      borderRadius: '12px',
                      textDecoration: 'none',
                      transition: 'all 0.3s ease',
                      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.borderColor = '#3c3d78';
                      e.currentTarget.style.boxShadow = '0 4px 12px rgba(60,61,120,0.15)';
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.borderColor = '#e5e7eb';
                      e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)';
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '12px' }}>
                      <i
                        className="ri-book-2-line"
                        style={{ fontSize: '24px', color: '#3c3d78', marginRight: '12px' }}
                      ></i>
                      <h3 style={{ color: '#1a1a1a', fontSize: '1.125rem', margin: 0 }}>
                        {t('cdlCurriculumTitle', 'CDL School Curriculum')}
                      </h3>
                    </div>
                    <p style={{ color: '#6b7280', fontSize: '0.875rem', margin: 0 }}>
                      {t(
                        'curriculumDesc',
                        "Detailed overview of what you'll learn in CDL training programs"
                      )}
                    </p>
                  </a>
                </Link>

                {/* CDL Jobs Card */}
                <Link href="/jobs" locale={locale} legacyBehavior>
                  <a
                    style={{
                      display: 'block',
                      padding: '24px',
                      backgroundColor: '#fff',
                      border: '2px solid #e5e7eb',
                      borderRadius: '12px',
                      textDecoration: 'none',
                      transition: 'all 0.3s ease',
                      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.borderColor = '#3c3d78';
                      e.currentTarget.style.boxShadow = '0 4px 12px rgba(60,61,120,0.15)';
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.borderColor = '#e5e7eb';
                      e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)';
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '12px' }}>
                      <i
                        className="ri-briefcase-line"
                        style={{ fontSize: '24px', color: '#3c3d78', marginRight: '12px' }}
                      ></i>
                      <h3 style={{ color: '#1a1a1a', fontSize: '1.125rem', margin: 0 }}>
                        {t('cdlJobs', 'CDL Jobs')}
                      </h3>
                    </div>
                    <p style={{ color: '#6b7280', fontSize: '0.875rem', margin: 0 }}>
                      {t('jobsDesc', 'Find truck driving jobs and career opportunities near you')}
                    </p>
                  </a>
                </Link>
              </div>
            </div>

            {/* Add Your School Section - Now in separate container */}
            <div
              style={{
                marginTop: '40px',
                backgroundColor: '#fff',
                borderRadius: '16px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                padding: '40px',
              }}
            >
              <div
                style={{
                  padding: '32px',
                  backgroundColor: '#f0f9ff',
                  borderRadius: '12px',
                  border: '1px solid #bae6fd',
                }}
              >
                <h3
                  style={{
                    fontSize: '1.25rem',
                    marginBottom: '16px',
                    color: '#0c4a6e',
                    fontWeight: '600',
                  }}
                >
                  {t('ownCdlSchool', 'Own a CDL School?')}
                </h3>
                <p style={{ color: '#075985', marginBottom: '20px', lineHeight: '1.6' }}>
                  {t(
                    'addSchoolInvite',
                    "If you own or manage a CDL training school and would like to add or update your school's information on our platform, we'd love to hear from you."
                  )}
                </p>
                <Link href="/contact" locale={locale} legacyBehavior>
                  <a
                    style={{
                      display: 'inline-block',
                      padding: '10px 24px',
                      backgroundColor: '#0284c7',
                      color: '#fff',
                      borderRadius: '8px',
                      textDecoration: 'none',
                      fontWeight: '600',
                      fontSize: '0.95rem',
                      transition: 'background-color 0.2s ease',
                    }}
                    onMouseEnter={e => (e.target.style.backgroundColor = '#0369a1')}
                    onMouseLeave={e => (e.target.style.backgroundColor = '#0284c7')}
                  >
                    {t('contactUs', 'Contact Us')}
                  </a>
                </Link>
              </div>
            </div>
          </div>
        </div>

        <Footer />
      </Layout>

      <style jsx>{`
        @media (max-width: 768px) {
          .schools-grid {
            grid-template-columns: 1fr !important;
            gap: 16px !important;
            padding: 0 10px !important;
          }
          .resources-grid {
            grid-template-columns: 1fr !important;
          }
        }
        @media (min-width: 769px) and (max-width: 1024px) {
          .resources-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
      `}</style>
    </>
  );
};

// Main component that decides which to render
const SchoolsRoutePage = ({ pageType, ...props }) => {
  if (pageType === 'state') {
    return <StateCitiesPage {...props} />;
  } else if (pageType === 'city') {
    return <CitySchoolsPage {...props} />;
  } else if (pageType === 'school') {
    return <SchoolProfilePage {...props} />;
  }

  // Should not reach here
  return null;
};

export async function getStaticPaths() {
  console.log('[getStaticPaths] Generating paths for school pages...');

  try {
    const paths = [];

    // List of known state slugs
    const stateSlugsList = [
      'alabama',
      'alaska',
      'arizona',
      'arkansas',
      'california',
      'colorado',
      'connecticut',
      'delaware',
      'florida',
      'georgia',
      'hawaii',
      'idaho',
      'illinois',
      'indiana',
      'iowa',
      'kansas',
      'kentucky',
      'louisiana',
      'maine',
      'maryland',
      'massachusetts',
      'michigan',
      'minnesota',
      'mississippi',
      'missouri',
      'montana',
      'nebraska',
      'nevada',
      'new-hampshire',
      'new-jersey',
      'new-mexico',
      'new-york',
      'north-carolina',
      'north-dakota',
      'ohio',
      'oklahoma',
      'oregon',
      'pennsylvania',
      'rhode-island',
      'south-carolina',
      'south-dakota',
      'tennessee',
      'texas',
      'utah',
      'vermont',
      'virginia',
      'washington',
      'west-virginia',
      'wisconsin',
      'wyoming',
      'district-of-columbia',
    ];

    // Pre-generate only for these locales
    const targetLocales = ['en', 'ru', 'uk'];

    // 1. Generate all state paths for target locales
    for (const state of stateSlugsList) {
      for (const locale of targetLocales) {
        paths.push({
          params: { params: [state] },
          locale,
        });
      }
    }

    // 2. Pre-generate city and school pages for all states in target locales
    if (process.env.NODE_ENV === 'production') {
      try {
        const { fetchCitiesForState, fetchSchoolsForCity } = await import(
          '../../src/entities/School/api/schoolApi'
        );

        const { formatStateName } = await import('../../src/shared/lib/utils/formatters');

        // Priority states to generate more cities/schools
        const priorityStates = ['california', 'texas', 'florida', 'new-york', 'illinois'];

        for (const stateSlug of stateSlugsList) {
          try {
            const cities = await fetchCitiesForState(formatStateName(stateSlug));

            // Determine how many cities to generate based on priority
            const cityLimit = priorityStates.includes(stateSlug) ? 20 : 5;
            const schoolLimit = priorityStates.includes(stateSlug) ? 10 : 3;

            // Generate city paths
            for (const city of cities.slice(0, cityLimit)) {
              for (const locale of targetLocales) {
                paths.push({
                  params: { params: [stateSlug, city.slug] },
                  locale,
                });
              }

              // Generate school paths for cities
              try {
                const schools = await fetchSchoolsForCity(formatStateName(stateSlug), city.name);

                for (const school of schools.slice(0, schoolLimit)) {
                  const schoolName = school.locations?.data?.[0]?.attributes?.Name;
                  if (schoolName) {
                    const schoolSlug = schoolName
                      .toLowerCase()
                      .replace(/[^a-z0-9]+/g, '-')
                      .replace(/(^-|-$)/g, '');

                    for (const locale of targetLocales) {
                      paths.push({
                        params: { params: [schoolSlug] },
                        locale,
                      });
                    }
                  }
                }
              } catch (error) {
                console.error(`[getStaticPaths] Error fetching schools for ${city.name}:`, error);
              }
            }
          } catch (error) {
            console.error(`[getStaticPaths] Error fetching cities for ${stateSlug}:`, error);
          }
        }
      } catch (error) {
        console.error('[getStaticPaths] Error importing API functions:', error);
      }
    }

    console.log(`[getStaticPaths] Generated ${paths.length} static paths`);

    return {
      paths,
      fallback: 'blocking', // Generate remaining pages on-demand
    };
  } catch (error) {
    console.error('[getStaticPaths] Error generating paths:', error);

    // Return minimal paths with blocking fallback
    return {
      paths: [],
      fallback: 'blocking',
    };
  }
}

export async function getStaticProps({ params, locale }) {
  const { params: routeParams } = params || {};

  console.log('[Schools Route] Processing params:', routeParams);

  if (!routeParams || routeParams.length === 0) {
    return {
      notFound: true,
    };
  }

  // Determine the type of page based on params length
  // 1 param: either state or school profile
  // 2 params: city page
  if (routeParams.length === 2) {
    // This is a city page: /schools/[state]/[city]
    const [state, city] = routeParams;
    console.log('[Schools Route] Detected as city page:', { state, city });

    try {
      const { fetchSchoolsForCity } = await import('../../src/entities/School/api/schoolApi');

      const stateFormatted = formatStateName(state);
      const cityFormatted = city.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());

      const [meta, schools] = await Promise.all([
        getMeta(locale || 'en', 'general'),
        fetchSchoolsForCity(stateFormatted, cityFormatted),
      ]);

      return {
        props: {
          pageType: 'city',
          schools,
          state,
          city,
          meta,
          ...(await serverSideTranslations(locale || 'en', [
            'navbar',
            'footer',
            'common',
            'city-schools',
            'index',
          ])),
        },
        revalidate: 300,
      };
    } catch (error) {
      console.error('[Schools Route] Error fetching city data:', error);
      return {
        notFound: true,
      };
    }
  }

  // Single param - check if it's a state or school
  const slug = routeParams[0];

  // List of known state slugs
  const stateSlugsList = [
    'alabama',
    'alaska',
    'arizona',
    'arkansas',
    'california',
    'colorado',
    'connecticut',
    'delaware',
    'florida',
    'georgia',
    'hawaii',
    'idaho',
    'illinois',
    'indiana',
    'iowa',
    'kansas',
    'kentucky',
    'louisiana',
    'maine',
    'maryland',
    'massachusetts',
    'michigan',
    'minnesota',
    'mississippi',
    'missouri',
    'montana',
    'nebraska',
    'nevada',
    'new-hampshire',
    'new-jersey',
    'new-mexico',
    'new-york',
    'north-carolina',
    'north-dakota',
    'ohio',
    'oklahoma',
    'oregon',
    'pennsylvania',
    'rhode-island',
    'south-carolina',
    'south-dakota',
    'tennessee',
    'texas',
    'utah',
    'vermont',
    'virginia',
    'washington',
    'west-virginia',
    'wisconsin',
    'wyoming',
    'district-of-columbia',
  ];

  // Check if it's a state
  if (stateSlugsList.includes(slug)) {
    console.log('[Schools Route] Detected as state:', slug);

    try {
      const { fetchCitiesForState } = await import('../../src/entities/School/api/schoolApi');

      const [meta, cities] = await Promise.all([
        getMeta(locale || 'en', 'general'),
        fetchCitiesForState(formatStateName(slug)),
      ]);

      return {
        props: {
          pageType: 'state',
          cities,
          state: slug,
          meta,
          ...(await serverSideTranslations(locale || 'en', [
            'navbar',
            'footer',
            'common',
            'city-schools',
            'index',
          ])),
        },
        revalidate: 300,
      };
    } catch (error) {
      console.error('[Schools Route] Error fetching state data:', error);
      const meta = await getMeta(locale || 'en', 'general');

      return {
        props: {
          pageType: 'state',
          cities: [],
          state: slug,
          meta,
          ...(await serverSideTranslations(locale || 'en', [
            'navbar',
            'footer',
            'common',
            'city-schools',
            'index',
          ])),
        },
        revalidate: 60,
      };
    }
  }

  // Otherwise, treat it as a school profile
  console.log('[Schools Route] Detected as school profile:', slug);

  try {
    const { fetchSchoolBySlug, fetchSchoolsByState } = await import(
      '../../src/entities/School/api/schoolApi'
    );

    const [baseMeta, school] = await Promise.all([
      getMeta(locale || 'en', 'general'),
      fetchSchoolBySlug(slug),
    ]);

    if (!school) {
      console.log('[Schools Route] School not found for slug:', slug);
      return {
        notFound: true,
      };
    }

    console.log('[Schools Route] Found school:', {
      id: school.id,
      name: school.locations?.data?.[0]?.attributes?.Name,
      coords: school.attributes?.coords,
    });

    // Customize meta for school profile
    const schoolName = school.locations?.data?.[0]?.attributes?.Name || 'CDL School';
    const cityFormatted = school.attributes?.city
      ? school.attributes.city.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
      : '';
    const stateFormatted = school.attributes?.state ? formatStateName(school.attributes.state) : '';

    // Fetch other schools from the same state
    let otherSchools = [];
    if (school.attributes?.state) {
      try {
        const allSchoolsInState = await fetchSchoolsByState(stateFormatted);
        // Filter out the current school and get up to 3 random schools
        const filteredSchools = allSchoolsInState.filter(s => s.id !== school.id);
        if (filteredSchools.length > 0) {
          // Shuffle and take up to 3
          const shuffled = filteredSchools.sort(() => 0.5 - Math.random());
          otherSchools = shuffled.slice(0, 3);
        }
      } catch (error) {
        console.error('[Schools Route] Error fetching other schools:', error);
        // Continue without other schools
      }
    }

    const meta = {
      ...baseMeta,
      title: `${schoolName} - CDL Training`,
      description: `${schoolName} is a CDL training school in ${cityFormatted}, ${stateFormatted}. Get information about their commercial driver's license programs, schedules, and contact details.`,
    };

    return {
      props: {
        pageType: 'school',
        school,
        otherSchools,
        meta,
        ...(await serverSideTranslations(locale || 'en', [
          'navbar',
          'footer',
          'common',
          'school-profile',
          'index',
        ])),
      },
      revalidate: 300,
    };
  } catch (error) {
    console.error('[Schools Route] Error fetching school:', error);
    return {
      notFound: true,
    };
  }
}

export default SchoolsRoutePage;
