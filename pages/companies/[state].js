import React, { useState, useEffect } from 'react';
import axios from 'axios';
import dynamic from 'next/dynamic';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import Image from 'next/image';
import Link from 'next/link';
import { SEOHead } from '../../src/shared/ui/SEO';

import Layout from '../../components/_App/Layout';
import Navbar from '../../components/_App/Navbar';
import Footer from '../../components/_App/Footer';
import PageBannerStyle1 from '../../components/Common/PageBannerStyle1';
import { DynamicQuiz } from '../../components/_App/DynamicImports';

const CompanyMap = dynamic(() => import('../../components/Common/SchoolMap'), {
    ssr: false,
});

const CompanyCard = ({ companyLocation, company, state }) => {
  const { t } = useTranslation('companies');
  const router = useRouter();
  const { locale } = router;
  
  const {
    Address,
    phone_number,
    coords,
    city,
    state: locationState,
    zip,
  } = companyLocation.attributes;

  const lat = coords?.latitude;
  const lon = coords?.longitude;

  const companyName = company?.name || 'Trucking Company';
  const companySlug = company?.slug || 'company';

  return (
    <Link href={`/${locale}/company/${companySlug}`}>
      <div className="company-card">
        <div className="company-card-map">
          {lat && lon ? (
              <CompanyMap lat={parseFloat(lat)} lon={parseFloat(lon)} />
          ) : (
            <div className="map-placeholder">
              <p>{t('mapNotAvailable')}</p>
            </div>
          )}
        </div>
        <div className="company-card-content">
          <div className="company-card-header">
            <h3>{companyName}</h3>
            {company?.pay_rate && (
              <span className="pay-rate-badge">{company.pay_rate.replace('_', ' ')}</span>
            )}
          </div>
          <div className="company-card-body">
              <p><strong>{t('addressLabel')}</strong> {Address}, {city}, {locationState.toUpperCase()} {zip ? String(zip) : ''}</p>
              {phone_number && <p><strong>{t('phoneLabel')}</strong> {phone_number}</p>}
          </div>
        </div>
        <style jsx>{`
          .company-card {
            border: 1px solid #eee;
            border-radius: 8px;
            margin-bottom: 20px;
            padding: 20px;
            display: flex;
            gap: 20px;
            background-color: #fff;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            cursor: pointer;
            transition: transform 0.2s ease, box-shadow 0.2s ease;
          }
          .company-card:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 8px rgba(0,0,0,0.15);
          }
          .company-card-map {
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
          .company-card-content {
            flex-grow: 1;
          }
          .company-card-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 15px;
          }
          .company-card-header h3 {
              margin: 0;
              font-size: 20px;
              color: #333;
          }
          .pay-rate-badge {
            background: #007bff;
            color: white;
            padding: 4px 8px;
            border-radius: 4px;
            font-size: 12px;
            text-transform: capitalize;
          }
          .company-card-body {
              margin: 15px 0;
          }
          .company-card-body p {
              margin: 5px 0;
              font-size: 14px;
              color: #666;
          }
        `}</style>
      </div>
    </Link>
  );
};

const capitalizeWords = (str) => str.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');

const StateCompaniesPage = ({ companyLocations, state }) => {
    const { t } = useTranslation(['companies', 'index']);
    const router = useRouter();
    const { locale } = router;
    const stateUpper = state.toUpperCase();
    
    const pageTitle = t('pageTitle', { state: stateUpper });
    const pageDescription = t('description', { state: stateUpper });

    const showQuiz = locale === 'ru' || locale === 'uk';

    return (
      <>
        <SEOHead
          title={pageTitle}
          description={pageDescription}
          url={`https://www.cdlhelp.com/companies/${state}`}
          type="article"
        />
        <Layout>
          <Navbar />
          <PageBannerStyle1
            pageTitle={pageTitle}
            homePageUrl="/companies"
            homePageText={t('homePageText')}
            activePageText={pageTitle}
          />
  
          <div className="container pb-100">
            <div className="state-companies-layout">
              <main className="main-content">
                <div className="companies-list">
                    {companyLocations.map(companyLocation => {
                        const company = companyLocation.attributes.company?.data?.attributes || null;
                        return (
                            <CompanyCard 
                                key={companyLocation.id} 
                                companyLocation={companyLocation}
                                company={company}
                                state={state}
                            />
                        );
                    })}
                </div>
              </main>
              {showQuiz && (
                <aside className="sidebar">
                  <div className="quiz-container">
                    <h3 style={{ textAlign: 'center', marginBottom: '1rem' }}>{t('companies:tryPermitQuiz')}</h3>
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
          .state-companies-layout {
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
            .state-companies-layout {
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
          const { data: companyLocationsData } = await axios.get(`http://${process.env.STRAPI_HOST}:${process.env.STRAPI_PORT}/api/company-locations?populate[company]=*`, {
              headers: { Authorization: `Bearer ${process.env.STRAPI_API_KEY}` },
          });
  
          const companyLocations = companyLocationsData.data;
          const stateSet = new Set();
  
          companyLocations.forEach(companyLocation => {
              const attributes = companyLocation.attributes;
              if (attributes && attributes.state) {
                  const stateSlug = attributes.state.toLowerCase().replace(/_/g, '-');
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
          console.error("Error fetching company locations for static paths:", error);
          return {
              paths: [],
              fallback: 'blocking',
          };
      }
  }
  
  
  export async function getStaticProps({ params, locale }) {
      const { state } = params;
      // Convert slug back to title case to match enum format (Kansas, New_York, etc.)
      const originalState = state.replace(/-/g, '_').split('_').map(word => 
          word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
      ).join('_');
  
      try {
          const { data: companyLocationsData } = await axios.get(`http://${process.env.STRAPI_HOST}:${process.env.STRAPI_PORT}/api/company-locations?populate[company]=*`, {
              headers: { Authorization: `Bearer ${process.env.STRAPI_API_KEY}` },
          });

          const allCompanyLocations = companyLocationsData.data;

                        const companyLocationsInState = allCompanyLocations.filter(companyLocation => {
                  const attributes = companyLocation.attributes;
                  return (
                      attributes &&
                      attributes.state &&
                      attributes.state === originalState
                  );
              });

          if (!companyLocationsInState || companyLocationsInState.length === 0) {
              return { notFound: true };
          }
  
          return {
              props: {
                  companyLocations: companyLocationsInState,
                  state: params.state,
                  ...(await serverSideTranslations(locale ?? 'en', ['navbar', 'footer', 'common', 'companies', 'index'])),
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
  
  export default StateCompaniesPage;
