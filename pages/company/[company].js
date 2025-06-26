import React from 'react';
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

const CompanyMap = dynamic(() => import('../../components/Common/SchoolMap'), {
    ssr: false,
});

const LocationCard = ({ location }) => {
  const { t } = useTranslation('company');
  const {
    Address,
    phone_number,
    coords,
    city,
    state,
    zip,
  } = location.attributes;

  const lat = coords?.latitude;
  const lon = coords?.longitude;
  const stateUpper = state?.replace(/_/g, ' ').toUpperCase();

  return (
    <div className="location-card">
      <div className="location-card-map">
        {lat && lon ? (
            <CompanyMap lat={parseFloat(lat)} lon={parseFloat(lon)} />
        ) : (
          <div className="map-placeholder">
            <p>{t('mapNotAvailable')}</p>
          </div>
        )}
      </div>
      <div className="location-card-content">
        <div className="location-card-header">
          <h4>{city}, {stateUpper}</h4>
        </div>
        <div className="location-card-body">
            <p><strong>{t('addressLabel')}</strong> {Address}</p>
            {zip && <p><strong>{t('zipLabel')}</strong> {String(zip)}</p>}
            {phone_number && <p><strong>{t('phoneLabel')}</strong> {phone_number}</p>}
        </div>
      </div>
      <style jsx>{`
        .location-card {
          border: 1px solid #eee;
          border-radius: 8px;
          margin-bottom: 20px;
          padding: 20px;
          display: flex;
          gap: 20px;
          background-color: #fff;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        .location-card-map {
          flex-shrink: 0;
          width: 250px;
          height: 150px;
        }
        .map-placeholder {
          width: 100%;
          height: 100%;
          background-color: #f0f0f0;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #aaa;
          font-size: 12px;
        }
        .location-card-content {
          flex-grow: 1;
        }
        .location-card-header h4 {
            margin: 0 0 10px 0;
            font-size: 18px;
            color: #333;
        }
        .location-card-body p {
            margin: 5px 0;
            font-size: 14px;
            color: #666;
        }
        @media (max-width: 768px) {
          .location-card {
            flex-direction: column;
          }
          .location-card-map {
            width: 100%;
            height: 200px;
          }
        }
      `}</style>
    </div>
  );
};

const CompanyPage = ({ company, locations }) => {
    const { t } = useTranslation(['company', 'index']);
    const router = useRouter();
    const { locale } = router;
    
    const {
        name,
        pay_rate,
        driver_type,
        trailer_type,
        truck_type
    } = company.attributes;
    
    const pageTitle = t('pageTitle', { company: name });
    const pageDescription = t('description', { company: name });

    const showQuiz = locale === 'ru' || locale === 'uk';

    const formatPayRate = (rate) => {
        if (!rate) return null;
        return rate.replace('_', ' ').toLowerCase();
    };

    const getDriverTypes = () => {
        if (!driver_type || !Array.isArray(driver_type)) return [];
        return driver_type.map(type => type.type).filter(Boolean);
    };

    const getTrailerTypes = () => {
        if (!trailer_type || !Array.isArray(trailer_type)) return [];
        return trailer_type.map(type => type.type).filter(Boolean);
    };

    const getTruckTypes = () => {
        if (!truck_type || !Array.isArray(truck_type)) return [];
        return truck_type.map(type => type.type).filter(Boolean);
    };

    return (
      <>
        <Head>
          <title>{pageTitle}</title>
          <meta name="description" content={pageDescription} />
        </Head>
        <Layout>
          <Navbar />
          <PageBannerStyle1
            pageTitle={name}
            homePageUrl="/companies"
            homePageText={t('homePageText')}
            activePageText={name}
          />
  
          <div className="container pb-100">
            <div className="company-layout">
              <main className="main-content">
                {/* Company Info Section */}
                <div className="company-info">
                  <div className="company-header">
                    <h1>{name}</h1>
                    {pay_rate && (
                      <span className="pay-rate-badge">
                        {t('payRate')}: {formatPayRate(pay_rate)}
                      </span>
                    )}
                  </div>
                  
                  <div className="company-details">
                    {getDriverTypes().length > 0 && (
                      <div className="detail-section">
                        <h3>{t('driverTypes')}</h3>
                        <div className="tags">
                          {getDriverTypes().map((type, index) => (
                            <span key={index} className="tag">{type}</span>
                          ))}
                        </div>
                      </div>
                    )}

                    {getTrailerTypes().length > 0 && (
                      <div className="detail-section">
                        <h3>{t('trailerTypes')}</h3>
                        <div className="tags">
                          {getTrailerTypes().map((type, index) => (
                            <span key={index} className="tag">{type}</span>
                          ))}
                        </div>
                      </div>
                    )}

                    {getTruckTypes().length > 0 && (
                      <div className="detail-section">
                        <h3>{t('truckTypes')}</h3>
                        <div className="tags">
                          {getTruckTypes().map((type, index) => (
                            <span key={index} className="tag">{type}</span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Locations Section */}
                <div className="locations-section">
                  <h2>{t('locationsTitle', { count: locations.length })}</h2>
                  <div className="locations-list">
                    {locations.map(location => (
                        <LocationCard key={location.id} location={location} />
                    ))}
                  </div>
                </div>
              </main>
              
              {showQuiz && (
                <aside className="sidebar">
                  <div className="quiz-container">
                    <h3 style={{ textAlign: 'center', marginBottom: '1rem' }}>{t('company:tryPermitQuiz')}</h3>
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
          .company-layout {
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
          .company-info {
            background: #fff;
            border-radius: 8px;
            padding: 30px;
            margin-bottom: 30px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          }
          .company-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 30px;
            flex-wrap: wrap;
            gap: 15px;
          }
          .company-header h1 {
            margin: 0;
            font-size: 32px;
            color: #333;
          }
          .pay-rate-badge {
            background: #28a745;
            color: white;
            padding: 8px 16px;
            border-radius: 6px;
            font-size: 14px;
            font-weight: 500;
          }
          .company-details {
            display: grid;
            gap: 25px;
          }
          .detail-section h3 {
            margin: 0 0 10px 0;
            font-size: 18px;
            color: #333;
          }
          .tags {
            display: flex;
            flex-wrap: wrap;
            gap: 8px;
          }
          .tag {
            background: #e9ecef;
            color: #495057;
            padding: 4px 12px;
            border-radius: 15px;
            font-size: 14px;
            border: 1px solid #dee2e6;
          }
          .locations-section h2 {
            margin: 0 0 20px 0;
            font-size: 24px;
            color: #333;
          }
          @media (max-width: 991px) {
            .company-layout {
              flex-direction: column;
            }
            .sidebar {
              width: 100%;
              margin-bottom: 2rem;
            }
            .company-header {
              flex-direction: column;
              align-items: flex-start;
            }
            .company-header h1 {
              font-size: 28px;
            }
          }
        `}</style>
      </>
    );
  };
  
  export async function getStaticPaths() {
      try {
          const { data: companiesData } = await axios.get(`http://${process.env.STRAPI_HOST}:${process.env.STRAPI_PORT}/api/companies?populate[company_locations]=*`, {
              headers: { Authorization: `Bearer ${process.env.STRAPI_API_KEY}` },
          });
  
          const companies = companiesData.data;
          const paths = companies.map(company => ({
              params: { company: company.attributes.slug }
          }));
  
          return {
              paths,
              fallback: 'blocking',
          };
      } catch (error) {
          console.error("Error fetching companies for static paths:", error);
          return {
              paths: [],
              fallback: 'blocking',
          };
      }
  }
  
  
  export async function getStaticProps({ params, locale }) {
      const { company: companySlug } = params;
  
      try {
          const { data: companiesData } = await axios.get(`http://${process.env.STRAPI_HOST}:${process.env.STRAPI_PORT}/api/companies?filters[slug][$eq]=${companySlug}&populate[company_locations]=*`, {
              headers: { Authorization: `Bearer ${process.env.STRAPI_API_KEY}` },
          });

          const companies = companiesData.data;
          
          if (!companies || companies.length === 0) {
              return { notFound: true };
          }

          const company = companies[0];
          const locations = company.attributes.company_locations?.data || [];

          if (locations.length === 0) {
              return { notFound: true };
          }
  
          return {
              props: {
                  company,
                  locations,
                  ...(await serverSideTranslations(locale ?? 'en', ['navbar', 'footer', 'common', 'company', 'index'])),
              },
              revalidate: 1,
          };
      } catch (error) {
          console.error(`Error fetching company data for ${companySlug}:`, error.response ? error.response.data : error.message);
          return {
              notFound: true,
          };
      }
  }
  
  export default CompanyPage; 