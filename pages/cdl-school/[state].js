import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import axios from 'axios';
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

const SchoolMap = dynamic(() => import('../../components/Common/SchoolMap'), {
    ssr: false,
});

const SchoolCard = ({ schoolLocation }) => {
  const { t } = useTranslation('city-schools');
  const {
    Address,
    phone_number,
    coords,
    city,
    state,
    location,
  } = schoolLocation.attributes;

  const lat = coords?.latitude;
  const lon = coords?.longitude;

  const stateUpper = state.toUpperCase();

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
          <h3>{location?.data?.attributes?.Name || 'CDL School'}</h3>
        </div>
        <div className="school-card-body">
            <p><strong>{t('addressLabel')}</strong> {Address}, {stateUpper}</p>
            <p><strong>{t('phoneLabel')}</strong> {phone_number}</p>
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
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
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

const capitalizeWords = (str) => str.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');

const StateSchoolsPage = ({ schoolLocations, state }) => {
    const { t } = useTranslation(['city-schools', 'index']);
    const router = useRouter();
    const { locale } = router;
    const stateUpper = state.toUpperCase();
    
    const pageTitle = t('pageTitle', { state: stateUpper });
    const pageDescription = t('description', { state: stateUpper });

    const showQuiz = locale === 'ru' || locale === 'uk';

    return (
      <>
        <Head>
          <title>{pageTitle}</title>
          <meta name="description" content={pageDescription} />
        </Head>
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
                    {schoolLocations.map(schoolLocation => (
                        <SchoolCard key={schoolLocation.id} schoolLocation={schoolLocation} />
                    ))}
                </div>
              </main>
              {showQuiz && (
                <aside className="sidebar">
                  <div className="quiz-container">
                    <h3 style={{ textAlign: 'center', marginBottom: '1rem' }}>{t('city-schools:tryPermitQuiz')}</h3>
                    <DynamicQuiz contained={false} />
                  </div>
                  <div className="btn-box color-wrap" style={{ marginTop: '20px', display: 'flex', justifyContent: 'center', gap: '15px' }}>
                      <a href={`https://play.google.com/store/apps/details?id=help.truckdriver.cdlhelp${locale == 'en' ? '' : `&hl=${locale}`}`} target="_blank" rel="noopener noreferrer" style={{
                        background: 'black',
                        borderRadius: '8px',
                        color: 'white',
                        padding: '10px 15px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        textDecoration: 'none'
                      }}>
                          <Image
                              src="/images/play-store.png"
                              alt={t("index:androidApp")}
                              width={27}
                              height={30}
                          />
                          <span>{t("index:androidApp")}</span>
                      </a>
                      <a href={`https://apps.apple.com/${locale == 'en' ? 'us' : locale}/app/cdl-help/id6444388755`} target="_blank" rel="noopener noreferrer" style={{
                        background: 'black',
                        borderRadius: '8px',
                        color: 'white',
                        padding: '10px 15px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        textDecoration: 'none'
                      }}>
                          <Image
                              src="/images/apple-store.png"
                              alt={t("index:iosApp")}
                              width={34}
                              height={35}
                          />
                          <span>{t("index:iosApp")}</span>
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
          const { data: schoolLocationsData } = await axios.get(`http://${process.env.STRAPI_HOST}:${process.env.STRAPI_PORT}/api/school-locations?populate[location]=*`, {
              headers: { Authorization: `Bearer ${process.env.STRAPI_API_KEY}` },
          });
  
          const schoolLocations = schoolLocationsData.data;
          const stateSet = new Set();
  
          schoolLocations.forEach(schoolLocation => {
              const attributes = schoolLocation.attributes;
              if (attributes && attributes.state) {
                  const stateSlug = attributes.state.toLowerCase().replace(/\s+/g, '-');
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
          console.error("Error fetching school locations for static paths:", error);
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
          const { data: schoolLocationsData } = await axios.get(`http://${process.env.STRAPI_HOST}:${process.env.STRAPI_PORT}/api/school-locations?populate[location]=*`, {
              headers: { Authorization: `Bearer ${process.env.STRAPI_API_KEY}` },
          });

          const allSchoolLocations = schoolLocationsData.data;

          const schoolLocationsInState = allSchoolLocations.filter(schoolLocation => {
              const attributes = schoolLocation.attributes;
              return (
                  attributes &&
                  attributes.state.toLowerCase() === originalState.toLowerCase()
              );
          });

          if (!schoolLocationsInState || schoolLocationsInState.length === 0) {
              return { notFound: true };
          }
  
          return {
              props: {
                  schoolLocations: schoolLocationsInState,
                  state: params.state,
                  ...(await serverSideTranslations(locale ?? 'en', ['navbar', 'footer', 'common', 'city-schools', 'index'])),
              },
              revalidate: 1,
          };
      } catch (error) {
          console.error(`Error fetching and processing data for ${originalState}:`, error.response ? error.response.data : error.message);
          return {
              notFound: true,
          };
      }
  }
  
  export default StateSchoolsPage; 