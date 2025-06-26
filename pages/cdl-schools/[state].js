import React from 'react';
import Image from 'next/image';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';

import Layout from '../../components/_App/Layout';
import Navbar from '../../components/_App/Navbar';
import Footer from '../../components/_App/Footer';
import PageBannerStyle1 from '../../components/Common/PageBannerStyle1';
import { DynamicQuiz } from '../../components/_App/DynamicImports';
import { SchoolList } from '../../src/widgets/SchoolList';
import { fetchSchoolsByState } from '../../src/entities/School';
import { formatStateName } from '../../src/shared/lib/utils/formatters';
import { SEOHead } from '../../src/shared/ui/SEO';

const StateSchoolsPage = ({ schoolLocations, state }) => {
  const { t } = useTranslation(['city-schools', 'index']);
  const router = useRouter();
  const { locale } = router;
  const stateFormatted = formatStateName(state);

  const pageTitle = t('pageTitle', { state: stateFormatted });
  const pageDescription = t('description', { state: stateFormatted });
  const showQuiz = locale === 'ru' || locale === 'uk';

  return (
    <>
      <SEOHead
        title={pageTitle}
        description={pageDescription}
        url={`https://www.cdlhelp.com/cdl-schools/${state}`}
        type="article"
      />
      <Layout alternateLinks={{}} dir="ltr">
        <Navbar alternateLinks={{}} />
        <PageBannerStyle1
          pageTitle={pageTitle}
          homePageUrl="/cdl-schools"
          homePageText={t('homePageText', 'CDL Schools')}
          activePageText={pageTitle}
        />

        <div style={{ 
          backgroundColor: '#f8fafc', 
          minHeight: 'calc(100vh - 200px)',
          paddingBottom: '100px'
        }}>
          <div style={{ 
            maxWidth: '100%',
            padding: '0 20px'
          }}>

            {/* Schools Grid */}
            <div className="schools-grid" style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
              gap: '24px',
              padding: '20px 0',
              maxWidth: '1400px',
              margin: '0 auto'
            }}>
              {schoolLocations.map(school => (
                <div key={school.id}>
                  <SchoolList 
                    schools={[school]}
                    loading={false}
                    error={null}
                  />
                </div>
              ))}
            </div>

            {schoolLocations.length === 0 && (
              <div style={{
                textAlign: 'center',
                padding: '60px 20px',
                background: '#fff',
                borderRadius: '16px',
                margin: '40px auto',
                maxWidth: '600px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
              }}>
                <h3 style={{
                  fontSize: '1.5rem',
                  color: '#374151',
                  marginBottom: '12px'
                }}>
                  {t('noSchoolsTitle', 'No Schools Found')}
                </h3>
                <p style={{
                  color: '#6b7280',
                  fontSize: '1rem'
                }}>
                  {t('noSchoolsText', { state: stateFormatted, defaultValue: `No CDL schools are currently available in ${stateFormatted}.` })}
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
          .header-section h1 {
            font-size: 1.8rem !important;
          }
          .quiz-section {
            padding: 20px !important;
          }
          .app-links {
            flex-direction: column !important;
            align-items: center !important;
          }
        }
      `}</style>
    </>
  );
};

export async function getStaticPaths() {
  // Определяем поддерживаемые штаты
  const supportedStates = [
    'california',
    'washington',
    'texas',
    'florida',
    'new-york',
    'new-jersey',
    'illinois',
    'pennsylvania'
  ];

  const paths = supportedStates.flatMap(state => [
    { params: { state }, locale: 'en' },
    { params: { state }, locale: 'ru' },
    { params: { state }, locale: 'uk' }
  ]);

  return {
    paths,
    fallback: 'blocking'
  };
}

export async function getStaticProps({ params, locale }) {
  const state = params?.state;

  if (!state) {
    return {
      notFound: true,
    };
  }

  try {
    const stateFormatted = formatStateName(state);
    
    const query = `
      query GetSchoolLocationsByState($state: String!) {
        schoolLocations(filters: { state: { eq: $state } }) {
          data {
            id
            attributes {
              Address
              phone_number
              coords
              city
              state
              zip
              locations {
                data {
                  id
                  attributes {
                    Name
                  }
                }
              }
            }
          }
        }
      }
    `;

    const response = await fetch(`http://${process.env.STRAPI_HOST}:${process.env.STRAPI_PORT}/graphql`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.STRAPI_API_KEY}`,
      },
      body: JSON.stringify({ 
        query,
        variables: { state: stateFormatted }
      }),
    });

    const { data } = await response.json();
    const schoolLocations = data?.schoolLocations?.data || [];

    return {
      props: {
        schoolLocations,
        state,
        ...(await serverSideTranslations(locale || 'en', [
          'navbar',
          'footer',
          'common',
          'city-schools',
          'index'
        ])),
      },
      revalidate: 300, // Revalidate every 5 minutes
    };
  } catch (error) {
    console.error('Error fetching schools for state:', state, error);
    
    return {
      props: {
        schoolLocations: [],
        state,
        ...(await serverSideTranslations(locale || 'en', [
          'navbar',
          'footer',
          'common',
          'city-schools',
          'index'
        ])),
      },
      revalidate: 60,
    };
  }
}

export default StateSchoolsPage; 