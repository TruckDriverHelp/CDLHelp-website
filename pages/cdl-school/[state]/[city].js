import React from 'react';
import Head from 'next/head';
import axios from 'axios';
import dynamic from 'next/dynamic';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import Image from 'next/image';

import Layout from '../../../components/_App/Layout';
import Navbar from '../../../components/_App/Navbar';
import Footer from '../../../components/_App/Footer';
import PageBannerStyle1 from '../../../components/Common/PageBannerStyle1';
import { DynamicQuiz } from '../../../components/_App/DynamicImports';

const SchoolMap = dynamic(() => import('../../../components/Common/SchoolMap'), {
    ssr: false,
});

const SchoolCard = ({ school }) => {
  const { t } = useTranslation('city-schools');
  const {
    school_name,
    phone_numbers,
    location,
  } = school.attributes;

  const lat = location.attributes.latitude;
  const lon = location.attributes.longitude;

  return (
    <div className="school-card">
      <div className="school-card-map">
        {lat && lon ? (
            <SchoolMap lat={lat} lon={lon} />
        ) : (
          <div className="map-placeholder">
            <p>{t('mapNotAvailable')}</p>
          </div>
        )}
      </div>
      <div className="school-card-content">
        <div className="school-card-header">
          <h3>{school_name}</h3>
        </div>
        <div className="school-card-body">
            <p><strong>{t('addressLabel')}</strong> {location.attributes.address_street}, {location.attributes.address_city}, {location.attributes.address_state} {location.attributes.address_zip}</p>
            <p><strong>{t('phoneLabel')}</strong> {phone_numbers[0]?.attributes.phone_number}</p>
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

const CitySchoolsPage = ({ schools, city, state }) => {
    const { t } = useTranslation(['city-schools', 'index']);
    const router = useRouter();
    const { locale } = router;
    
    const formattedCity = capitalizeWords(city.replace(/-/g, ' '));
    const formattedState = capitalizeWords(state.replace(/-/g, ' '));
    
    const pageTitle = t('pageTitle', { city: formattedCity, state: formattedState });
    const pageDescription = t('description', { city: formattedCity, state: formattedState });

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
            <div className="city-schools-layout">
              <main className="main-content">
                <div className="schools-list">
                    {schools.map(school => (
                        <SchoolCard key={school.id} school={school} />
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
          .city-schools-layout {
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
            .city-schools-layout {
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
          const { data: locationsData } = await axios.get(`http://${process.env.STRAPI_HOST}:${process.env.STRAPI_PORT}/api/locations`, {
              headers: { Authorization: `Bearer ${process.env.STRAPI_API_KEY}` },
          });
  
          const locations = locationsData.data;
          const locationSet = new Set();
  
          locations.forEach(location => {
              const attributes = location.attributes;
              if (attributes && attributes.address_city && attributes.address_state) {
                  const citySlug = attributes.address_city.toLowerCase().replace(/\s+/g, '-');
                  const stateSlug = attributes.address_state.toLowerCase().replace(/\s+/g, '-');
                  locationSet.add(`${stateSlug}/${citySlug}`);
              }
          });
  
          const paths = Array.from(locationSet).map(slug => {
              const [state, city] = slug.split('/');
              return { params: { state, city } };
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
      const { city, state } = params;
      const originalCity = city.replace(/-/g, ' ');
      const originalState = state.replace(/-/g, ' ');
  
      try {
          const { data: schoolsData } = await axios.get(`http://${process.env.STRAPI_HOST}:${process.env.STRAPI_PORT}/api/schools?populate[location]=*&populate[phone_numbers]=*`, {
              headers: { Authorization: `Bearer ${process.env.STRAPI_API_KEY}` },
          });

          const allSchools = schoolsData.data;

          const schoolsInCity = allSchools.filter(school => {
              const locationAttrs = school.attributes.location?.data[0]?.attributes;
              return (
                  locationAttrs &&
                  locationAttrs.address_city.toLowerCase() === originalCity.toLowerCase() &&
                  locationAttrs.address_state.toLowerCase() === originalState.toLowerCase()
              );
          }).map(school => {
              return {
                  id: school.id,
                  attributes: {
                      ...school.attributes,
                      location: school.attributes.location.data[0],
                      phone_numbers: school.attributes.phone_numbers.data,
                  }
              }
          });

          if (!schoolsInCity || schoolsInCity.length === 0) {
              return { notFound: true };
          }
  
          return {
              props: {
                  schools: schoolsInCity,
                  city: params.city,
                  state: params.state,
                  ...(await serverSideTranslations(locale ?? 'en', ['navbar', 'footer', 'common', 'city-schools', 'index'])),
              },
              revalidate: 1,
          };
      } catch (error) {
          console.error(`Error fetching and processing data for ${originalCity}, ${originalState}:`, error.response ? error.response.data : error.message);
          return {
              notFound: true,
          };
      }
  }
  
  export default CitySchoolsPage;
  