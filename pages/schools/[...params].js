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
const SchoolProfilePage = ({ school, meta }) => {
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

                {/* Call to Action */}
                <div
                  style={{
                    marginTop: '40px',
                    padding: '32px',
                    backgroundColor: '#f9fafb',
                    borderRadius: '12px',
                    textAlign: 'center',
                  }}
                >
                  <h3
                    style={{
                      fontSize: '1.125rem',
                      marginBottom: '16px',
                      color: '#1a1a1a',
                    }}
                  >
                    {t('interested', 'Interested in this school?')}
                  </h3>
                  <p style={{ color: '#6b7280', marginBottom: '20px' }}>
                    {t(
                      'contactDirectly',
                      'Contact them directly to learn more about their CDL training programs.'
                    )}
                  </p>
                  {phone_number && (
                    <a
                      href={`tel:${phone_number}`}
                      style={{
                        display: 'inline-block',
                        padding: '12px 32px',
                        backgroundColor: '#3c3d78',
                        color: '#fff',
                        borderRadius: '8px',
                        textDecoration: 'none',
                        fontWeight: '600',
                        transition: 'background-color 0.2s ease',
                      }}
                      onMouseEnter={e => (e.target.style.backgroundColor = '#2d2e5f')}
                      onMouseLeave={e => (e.target.style.backgroundColor = '#3c3d78')}
                    >
                      {t('callNow', 'Call Now')}
                    </a>
                  )}
                </div>
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

    // Priority states with more schools (generate all pages for these)
    const priorityStates = ['california', 'texas', 'florida', 'new-york', 'illinois'];

    // Available locales - prioritize English
    const locales = ['en'];
    const additionalLocales = ['ru', 'uk', 'ar', 'ko', 'zh', 'tr', 'pt'];

    // 1. Generate all state paths for English
    for (const state of stateSlugsList) {
      paths.push({
        params: { params: [state] },
        locale: 'en',
      });
    }

    // 2. Generate state paths for other locales only for priority states
    for (const state of priorityStates) {
      for (const locale of additionalLocales) {
        paths.push({
          params: { params: [state] },
          locale,
        });
      }
    }

    // 3. Pre-generate city and school pages only for priority states in English
    if (process.env.NODE_ENV === 'production') {
      try {
        const { fetchCitiesForState, fetchSchoolsForCity } = await import(
          '../../src/entities/School/api/schoolApi'
        );

        const { formatStateName } = await import('../../src/shared/lib/utils/formatters');

        for (const stateSlug of priorityStates) {
          try {
            const cities = await fetchCitiesForState(formatStateName(stateSlug));

            // Generate city paths
            for (const city of cities.slice(0, 10)) {
              // Limit to top 10 cities per state
              paths.push({
                params: { params: [stateSlug, city.slug] },
                locale: 'en',
              });

              // Generate school paths for top cities
              try {
                const schools = await fetchSchoolsForCity(formatStateName(stateSlug), city.name);

                for (const school of schools.slice(0, 5)) {
                  // Limit to top 5 schools per city
                  const schoolName = school.locations?.data?.[0]?.attributes?.Name;
                  if (schoolName) {
                    const schoolSlug = schoolName
                      .toLowerCase()
                      .replace(/[^a-z0-9]+/g, '-')
                      .replace(/(^-|-$)/g, '');

                    paths.push({
                      params: { params: [schoolSlug] },
                      locale: 'en',
                    });
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
    const { fetchSchoolBySlug } = await import('../../src/entities/School/api/schoolApi');

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

    const meta = {
      ...baseMeta,
      title: `${schoolName} - CDL Training`,
      description: `${schoolName} is a CDL training school in ${cityFormatted}, ${stateFormatted}. Get information about their commercial driver's license programs, schedules, and contact details.`,
    };

    return {
      props: {
        pageType: 'school',
        school,
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
