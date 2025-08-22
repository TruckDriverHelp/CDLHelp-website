import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import dynamic from 'next/dynamic';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import Image from 'next/image';

import Layout from '../../components/_App/Layout';
import Navbar from '../../components/_App/Navbar';
import Footer from '../../components/_App/Footer';
import PageBannerStyle1 from '../../components/Common/PageBannerStyle1';
import { DynamicQuiz } from '../../components/_App/DynamicImports';
import { SchemaBuilder } from '../../src/shared/ui/SEO/schemas';
import { StructuredData } from '../../src/shared/ui/SEO/StructuredData';

const SchoolMap = dynamic(() => import('../../components/Common/SchoolMap'), {
  ssr: false,
});

const SchoolCard = ({ schoolName, location }) => {
  const { t } = useTranslation('city-schools');
  const { Address, phone_number, coords, city, state } = location.attributes;

  const lat = coords?.latitude;
  const lon = coords?.longitude;

  const stateFormatted = state ? state.replace(/_/g, ' ') : '';

  return (
    <div className="school-card">
      <div className="school-card-map">
        {lat && lon ? (
          <SchoolMap lat={parseFloat(lat)} lon={parseFloat(lon)} />
        ) : (
          <div className="map-placeholder">
            <p>{t('mapNotAvailable')}</p>
          </div>
        )}
      </div>
      <div className="school-card-content">
        <div className="school-card-header">
          <h3>{schoolName || 'CDL School'}</h3>
        </div>
        <div className="school-card-body">
          <p>
            <strong>{t('addressLabel')}</strong> {Address}, {stateFormatted}
          </p>
          <p>
            <strong>{t('phoneLabel')}</strong> {phone_number}
          </p>
        </div>
      </div>
      <style jsx>{`
        .school-card {
          border: 1px solid #eee;
          border-radius: 8px;
          margin-bottom: 20px;
          padding: 20px;
          display: flex;
          gap: 20px;
          background-color: #fff;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
        .school-card-map {
          flex-shrink: 0;
          width: 300px;
          height: 200px;
        }
        .map-placeholder {
          width: 100%;
          height: 100%;
          background-color: #f0f0f0;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #aaa;
        }
        .school-card-content {
          flex-grow: 1;
        }
        .school-card-header h3 {
          margin: 0;
          font-size: 20px;
        }
        .school-card-body {
          margin: 15px 0;
        }
        .school-card-body p {
          margin: 5px 0;
          font-size: 14px;
        }
      `}</style>
    </div>
  );
};

const stateNameMapping = {
  alabama: 'Alabama',
  alaska: 'Alaska',
  arizona: 'Arizona',
  arkansas: 'Arkansas',
  california: 'California',
  colorado: 'Colorado',
  connecticut: 'Connecticut',
  delaware: 'Delaware',
  florida: 'Florida',
  georgia: 'Georgia',
  hawaii: 'Hawaii',
  idaho: 'Idaho',
  illinois: 'Illinois',
  indiana: 'Indiana',
  iowa: 'Iowa',
  kansas: 'Kansas',
  kentucky: 'Kentucky',
  louisiana: 'Louisiana',
  maine: 'Maine',
  maryland: 'Maryland',
  massachusetts: 'Massachusetts',
  michigan: 'Michigan',
  minnesota: 'Minnesota',
  mississippi: 'Mississippi',
  missouri: 'Missouri',
  montana: 'Montana',
  nebraska: 'Nebraska',
  nevada: 'Nevada',
  'new hampshire': 'New Hampshire',
  'new jersey': 'New Jersey',
  'new mexico': 'New Mexico',
  'new york': 'New York',
  'north carolina': 'North Carolina',
  'north dakota': 'North Dakota',
  ohio: 'Ohio',
  oklahoma: 'Oklahoma',
  oregon: 'Oregon',
  pennsylvania: 'Pennsylvania',
  'rhode island': 'Rhode Island',
  'south carolina': 'South Carolina',
  'south dakota': 'South Dakota',
  tennessee: 'Tennessee',
  texas: 'Texas',
  utah: 'Utah',
  vermont: 'Vermont',
  virginia: 'Virginia',
  washington: 'Washington',
  'west virginia': 'West Virginia',
  wisconsin: 'Wisconsin',
  wyoming: 'Wyoming',
};

const formatStateName = stateSlug => {
  const normalizedSlug = stateSlug.replace(/-/g, ' ').toLowerCase();
  return (
    stateNameMapping[normalizedSlug] ||
    stateSlug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
  );
};

const capitalizeWords = str =>
  str
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

const StateSchoolsPage = ({ schools, state }) => {
  const { t } = useTranslation(['city-schools', 'index']);
  const router = useRouter();
  const { locale } = router;
  const stateFormatted = formatStateName(state);

  const pageTitle = t('pageTitle', { state: stateFormatted });
  const pageDescription = t('description', { state: stateFormatted });

  const showQuiz = locale === 'ru' || locale === 'uk';

  // Build comprehensive schemas for state schools page
  const schemas = new SchemaBuilder(locale)
    .addOrganization({
      description: 'CDL Help - Free CDL practice tests and trucking school directory',
    })
    .addWebsite({
      description: `Find CDL schools in ${stateFormatted}`,
    })
    .addBreadcrumb([
      { name: t('home', 'Home'), url: '/' },
      { name: t('schools', 'CDL Schools'), url: '/schools' },
      { name: `${stateFormatted} CDL Schools`, url: `/school/${state}` },
    ])
    .addWebPage({
      name: pageTitle,
      description: pageDescription,
      url: `https://www.cdlhelp.com${locale === 'en' ? '' : `/${locale}`}/school/${state}`,
      datePublished: '2023-01-01',
      dateModified: new Date().toISOString(),
    })
    .addItemList({
      name: `CDL Schools in ${stateFormatted}`,
      description: `Complete list of CDL truck driving schools in ${stateFormatted}`,
      url: `https://www.cdlhelp.com${locale === 'en' ? '' : `/${locale}`}/school/${state}`,
      numberOfItems: schools.reduce((count, school) => count + school.locations.length, 0),
      itemListElement: schools.flatMap((school, schoolIndex) =>
        school.locations.map((location, locationIndex) => ({
          '@type': 'ListItem',
          position: schoolIndex * 10 + locationIndex + 1,
          name: school.attributes.name,
          item: {
            '@type': 'EducationalOrganization',
            '@id': `#school-${school.id || schoolIndex}-${location.id || locationIndex}`,
            name: school.attributes.name,
            address: {
              '@type': 'PostalAddress',
              streetAddress: location.attributes.Address,
              addressLocality: location.attributes.city,
              addressRegion: location.attributes.state?.replace(/_/g, ' '),
              addressCountry: 'US',
            },
            telephone: location.attributes.phone_number,
            geo: location.attributes.coords
              ? {
                  '@type': 'GeoCoordinates',
                  latitude: location.attributes.coords.latitude,
                  longitude: location.attributes.coords.longitude,
                }
              : undefined,
          },
        }))
      ),
    })
    .addCourse({
      name: `CDL Training in ${stateFormatted}`,
      description: `Commercial Driver's License training programs available in ${stateFormatted}`,
      teaches: [
        'CDL Class A License',
        'CDL Class B License',
        'Pre-Trip Inspection',
        'Backing and Parking',
        'Road Driving',
      ],
      educationalLevel: 'Professional Certification',
      educationalCredentialAwarded: 'Commercial Driver License',
    })
    .build();

  return (
    <>
      <Head>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
      </Head>

      {/* Structured Data Schemas */}
      <StructuredData data={schemas} />

      <Layout>
        <Navbar />
        <PageBannerStyle1
          pageTitle={pageTitle}
          homePageUrl="/cdl-school"
          homePageText={t('homePageText')}
          activePageText={pageTitle}
        />

        <div className="container pb-100">
          <div className="state-schools-layout">
            <main className="main-content">
              <div className="schools-list">
                {schools.map(school =>
                  school.locations.map(location => (
                    <SchoolCard
                      key={location.id}
                      schoolName={school.attributes.name}
                      location={location}
                    />
                  ))
                )}
              </div>
            </main>
            {showQuiz && (
              <aside className="sidebar">
                <div className="quiz-container">
                  <h3 style={{ textAlign: 'center', marginBottom: '1rem' }}>
                    {t('city-schools:tryPermitQuiz')}
                  </h3>
                  <DynamicQuiz contained={false} />
                </div>
                <div
                  className="btn-box color-wrap"
                  style={{
                    marginTop: '20px',
                    display: 'flex',
                    justifyContent: 'center',
                    gap: '15px',
                  }}
                >
                  <a
                    href={`https://play.google.com/store/apps/details?id=help.truckdriver.cdlhelp${locale == 'en' ? '' : `&hl=${locale}`}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      background: 'black',
                      borderRadius: '8px',
                      color: 'white',
                      padding: '10px 15px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      textDecoration: 'none',
                    }}
                  >
                    <Image
                      src="/images/play-store.png"
                      alt={t('index:androidApp')}
                      width={27}
                      height={30}
                    />
                    <span>{t('index:androidApp')}</span>
                  </a>
                  <a
                    href={`https://apps.apple.com/${locale == 'en' ? 'us' : locale}/app/cdl-help/id6444388755`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      background: 'black',
                      borderRadius: '8px',
                      color: 'white',
                      padding: '10px 15px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      textDecoration: 'none',
                    }}
                  >
                    <Image
                      src="/images/apple-store.png"
                      alt={t('index:iosApp')}
                      width={34}
                      height={35}
                    />
                    <span>{t('index:iosApp')}</span>
                  </a>
                </div>
              </aside>
            )}
          </div>
        </div>

        <Footer />
      </Layout>
      <style jsx>{`
        .state-schools-layout {
          display: flex;
          gap: 2rem;
          margin-top: 20px;
        }
        .main-content {
          flex-grow: 1;
        }
        .sidebar {
          width: 300px;
          flex-shrink: 0;
        }
        .quiz-container {
          background: #f0f2f5;
          border-radius: 8px;
          padding: 20px;
        }
        @media (max-width: 991px) {
          .state-schools-layout {
            flex-direction: column;
          }
          .sidebar {
            width: 100%;
            margin-bottom: 2rem;
          }
        }
      `}</style>
    </>
  );
};

export async function getStaticPaths() {
  try {
    const response = await fetch(
      `http://${process.env.STRAPI_HOST}:${process.env.STRAPI_PORT}/api/school-locations?fields[0]=state`,
      {
        headers: {
          Authorization: `Bearer ${process.env.STRAPI_API_KEY}`,
        },
      }
    );

    if (!response.ok) {
      if (process.env.NODE_ENV === 'development') {
        console.error(
          'REST API request failed for static paths:',
          response.status,
          response.statusText
        );
      }
      return {
        paths: [],
        fallback: 'blocking',
      };
    }

    const responseData = await response.json();

    // Check if response has the expected structure
    if (!responseData || !responseData.data) {
      if (process.env.NODE_ENV === 'development') {
        console.error('Invalid response structure for static paths:', responseData);
      }
      return {
        paths: [],
        fallback: 'blocking',
      };
    }

    const schoolLocations = responseData.data;
    const stateSet = new Set();

    schoolLocations.forEach(schoolLocation => {
      const attributes = schoolLocation.attributes;
      if (attributes && attributes.state) {
        const stateSlug = attributes.state.toLowerCase().replace(/_/g, ' ').replace(/\s+/g, '-');
        stateSet.add(stateSlug);
      }
    });

    const paths = Array.from(stateSet).map(state => {
      return { params: { state } };
    });

    return {
      paths,
      fallback: 'blocking',
    };
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('Error fetching school locations for static paths:', error);
    }
    if (process.env.NODE_ENV === 'development') {
      console.error('Full error:', error);
    }
    return {
      paths: [],
      fallback: 'blocking',
    };
  }
}

export async function getStaticProps({ params, locale }) {
  const { state } = params;
  const originalState = state.replace(/-/g, ' ');

  try {
    // Fetch all schools with their school-locations
    const response = await fetch(
      `http://${process.env.STRAPI_HOST}:${process.env.STRAPI_PORT}/api/schools?populate=school-locations`,
      {
        headers: {
          Authorization: `Bearer ${process.env.STRAPI_API_KEY}`,
        },
      }
    );

    if (!response.ok) {
      if (process.env.NODE_ENV === 'development') {
        console.error(
          `REST API request failed for ${originalState}:`,
          response.status,
          response.statusText
        );
      }
      return { notFound: true };
    }

    const responseData = await response.json();
    if (!responseData || !responseData.data) {
      if (process.env.NODE_ENV === 'development') {
        console.error(`Invalid response structure for ${originalState}:`, responseData);
      }
      return { notFound: true };
    }

    // Filter schools that have at least one location in the requested state
    const schoolsWithLocationsInState = responseData.data
      .map(school => {
        const locations = school.attributes['school-locations']?.data || [];
        // Filter locations by state
        const filteredLocations = locations.filter(
          loc =>
            loc.attributes.state.toLowerCase().replace(/_/g, ' ') === originalState.toLowerCase()
        );
        return filteredLocations.length > 0 ? { ...school, locations: filteredLocations } : null;
      })
      .filter(Boolean);

    if (!schoolsWithLocationsInState.length) {
      return { notFound: true };
    }

    return {
      props: {
        schools: schoolsWithLocationsInState,
        state: params.state,
        ...(await serverSideTranslations(locale ?? 'en', [
          'navbar',
          'footer',
          'common',
          'city-schools',
          'index',
        ])),
      },
      revalidate: 1,
    };
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error(`Error fetching and processing data for ${originalState}:`, error.message);
    }
    return { notFound: true };
  }
}

export default StateSchoolsPage;
