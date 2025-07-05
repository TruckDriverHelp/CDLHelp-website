import React from 'react';
import Link from 'next/link';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';

import Layout from '../../components/_App/Layout';
import Navbar from '../../components/_App/Navbar';
import Footer from '../../components/_App/Footer';
import PageBannerStyle1 from '../../components/Common/PageBannerStyle1';
import { formatStateName } from '../../src/shared/lib/utils/formatters';
import { SEOHead } from '../../src/shared/ui/SEO';
import { useSEO } from '../../src/shared/lib/hooks/useSEO';
import getMeta from '../../lib/getMeta';

const StateCitiesPage = ({ cities, state, meta }) => {
  const { t } = useTranslation(['city-schools', 'index']);
  // const router = useRouter();
  // const { locale } = router;
  const stateFormatted = formatStateName(state);

  const seoData = useSEO({
    meta,
    customUrl: `https://www.cdlhelp.com/cdl-schools/${state}`,
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
            defaultValue: `CDL Schools in ${stateFormatted}`,
          })}
          homePageUrl="/cdl-schools"
          homePageText={t('schoolsTitle', 'CDL Schools')}
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
                <Link key={city.slug} href={`/cdl-schools/${state}/${city.slug}`}>
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

export async function getStaticPaths() {
  try {
    // Get all states from new API
    const { fetchStatesWithCities } = await import('../../src/entities/School/api/schoolApi');
    const states = await fetchStatesWithCities();

    const paths = states.flatMap(state => [
      { params: { state: state.slug }, locale: undefined }, // English without /en/ prefix
      { params: { state: state.slug }, locale: 'ru' },
      { params: { state: state.slug }, locale: 'uk' },
      { params: { state: state.slug }, locale: 'ar' },
      { params: { state: state.slug }, locale: 'ko' },
      { params: { state: state.slug }, locale: 'zh' },
      { params: { state: state.slug }, locale: 'tr' },
      { params: { state: state.slug }, locale: 'pt' },
    ]);

    return {
      paths,
      fallback: 'blocking',
    };
  } catch (error) {
    return {
      paths: [],
      fallback: 'blocking',
    };
  }
}

export async function getStaticProps({ params, locale }) {
  const state = params?.state;

  if (!state) {
    return {
      notFound: true,
    };
  }

  try {
    // Import function dynamically for server-side
    const { fetchCitiesForState } = await import('../../src/entities/School/api/schoolApi');

    const [meta, cities] = await Promise.all([
      getMeta(locale || 'en', 'general'),
      fetchCitiesForState(formatStateName(state)),
    ]);

    return {
      props: {
        cities,
        state,
        meta,
        ...(await serverSideTranslations(locale || 'en', [
          'navbar',
          'footer',
          'common',
          'city-schools',
          'index',
        ])),
      },
      revalidate: 300, // Revalidate every 5 minutes
    };
  } catch (error) {
    const meta = await getMeta(locale || 'en', 'general');

    return {
      props: {
        cities: [],
        state,
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

export default StateCitiesPage;
