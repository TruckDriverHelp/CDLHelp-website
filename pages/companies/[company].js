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

const SchoolMap = dynamic(() => import('../../components/Common/SchoolMap'), {
    ssr: false,
});

const CompanyCard = ({ company }) => {
  const { t } = useTranslation('company-page');
  const {
    company_name,
    phone_numbers,
    location,
    driver_type,
    pay_rate,
    pay_terms,
    trailer_type,
    truck_type,
  } = company.attributes;

  const lat = location?.attributes.latitude;
  const lon = location?.attributes.longitude;

  return (
    <div className="company-card">
      <div className="company-card-map">
        {lat && lon ? (
            <SchoolMap lat={lat} lon={lon} />
        ) : (
          <div className="map-placeholder">
            <p>{t('mapNotAvailable', 'Map not available')}</p>
          </div>
        )}
      </div>
      <div className="company-card-content">
        <div className="company-card-header">
          <h3>{company_name}</h3>
        </div>
        <div className="company-card-body">
            {location && <p><strong>{t('addressLabel', 'Address:')}</strong> {location.attributes.address_street}, {location.attributes.address_city}, {location.attributes.address_state} {location.attributes.address_zip}</p>}
            {phone_numbers && phone_numbers.length > 0 && <p><strong>{t('phoneLabel', 'Phone:')}</strong> {phone_numbers[0]?.attributes.phone_number}</p>}
            {driver_type && <p><strong>{t('driverTypeLabel', 'Driver Type:')}</strong> {driver_type}</p>}
            {pay_rate && pay_terms && <p><strong>{t('payLabel', 'Pay:')}</strong> {pay_rate} ({pay_terms})</p>}
            {trailer_type && <p><strong>{t('trailerTypeLabel', 'Trailer:')}</strong> {trailer_type}</p>}
            {truck_type && <p><strong>{t('truckTypeLabel', 'Truck:')}</strong> {truck_type}</p>}
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
        .company-card-header h3 {
            margin: 0;
            font-size: 20px;
        }
        .company-card-body {
            margin: 15px 0;
        }
        .company-card-body p {
            margin: 5px 0;
            font-size: 14px;
        }
        @media (max-width: 767px) {
          .company-card {
            flex-direction: column;
          }
          .company-card-map {
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
};

const CompanyPage = ({ company }) => {
    const { t } = useTranslation(['company-page', 'index']);
    const router = useRouter();
    const { locale } = router;
    
    const pageTitle = company.attributes.company_name;
    const pageDescription = t('description', { companyName: company.attributes.company_name });

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
            homePageUrl="/copanies"
            homePageText={t('homePageText', 'Companies')}
            activePageText={company.attributes.company_name}
          />
  
          <div className="container pb-100">
            <div className="company-page-layout">
              <main className="main-content">
                <CompanyCard company={company} />
              </main>
              {showQuiz && (
                <aside className="sidebar">
                  <div className="quiz-container">
                    <h3 style={{ textAlign: 'center', marginBottom: '1rem' }}>{t('index:tryPermitQuiz')}</h3>
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
          .company-page-layout {
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
            .company-page-layout {
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
        const { data: companiesData } = await axios.get(`http://${process.env.STRAPI_HOST}:${process.env.STRAPI_PORT}/api/companies?fields[0]=slug`, {
            headers: { Authorization: `Bearer ${process.env.STRAPI_API_KEY}` },
        });

        const paths = companiesData.data.map(company => ({
            params: { company: company.attributes.slug },
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
        const { data: companyData } = await axios.get(`http://${process.env.STRAPI_HOST}:${process.env.STRAPI_PORT}/api/companies?filters[slug][$eq]=${companySlug}&populate[location]=*&populate[phone_numbers]=*`, {
            headers: { Authorization: `Bearer ${process.env.STRAPI_API_KEY}` },
        });

        if (!companyData.data || companyData.data.length === 0) {
            return { notFound: true };
        }
        
        const company = {
            id: companyData.data[0].id,
            attributes: {
                ...companyData.data[0].attributes,
                location: companyData.data[0].attributes.location.data,
                phone_numbers: companyData.data[0].attributes.phone_numbers.data,
            }
        };

        return {
            props: {
                company,
                ...(await serverSideTranslations(locale ?? 'en', ['navbar', 'footer', 'common', 'company-page', 'index'])),
            },
            revalidate: 1,
        };
    } catch (error) {
        console.error(`Error fetching and processing data for company ${companySlug}:`, error.response ? error.response.data : error.message);
        return {
            notFound: true,
        };
    }
}
  
export default CompanyPage;
