import React from 'react';
import axios from 'axios';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Image from 'next/image';
import Head from 'next/head';
import { SEOHead } from '../src/shared/ui/SEO';

import Layout from '../components/_App/Layout';
import Navbar from '../components/_App/Navbar';
import Footer from '../components/_App/Footer';
import PageBannerStyle1 from '../components/Common/PageBannerStyle1';
import { DynamicQuiz } from '../components/_App/DynamicImports';
import RelatedLinks from '../components/Common/RelatedLinks';

const CompanyCard = ({ company }) => {
  const { t } = useTranslation('companies');
  const { locale } = useRouter();

  const { name, slug, pay_rate, driver_type, trailer_type, company_locations } = company.attributes;

  const locations = company_locations?.data || [];
  const locationCount = locations.length;
  const firstLocation = locations[0]?.attributes;

  const formatPayRate = rate => {
    if (!rate) return null;
    return rate.replace('_', ' ').toLowerCase();
  };

  const getDriverTypes = () => {
    if (!driver_type || !Array.isArray(driver_type)) return [];
    return driver_type
      .map(type => type.type)
      .filter(Boolean)
      .slice(0, 3);
  };

  const getTrailerTypes = () => {
    if (!trailer_type || !Array.isArray(trailer_type)) return [];
    return trailer_type
      .map(type => type.type)
      .filter(Boolean)
      .slice(0, 2);
  };

  return (
    <Link href={`/${locale}/company/${slug}`}>
      <div className="company-card">
        <div className="company-card-header">
          <div className="company-info">
            <h3 className="company-name">{name}</h3>
            {firstLocation && (
              <p className="company-location">
                {firstLocation.city}, {firstLocation.state?.replace(/_/g, ' ')}
                {locationCount > 1 && ` +${locationCount - 1} ${t('moreLocations')}`}
              </p>
            )}
          </div>
          {pay_rate && (
            <div className="pay-rate-badge">
              {t('payRate')}: {formatPayRate(pay_rate)}
            </div>
          )}
        </div>

        <div className="company-details">
          {getDriverTypes().length > 0 && (
            <div className="detail-row">
              <span className="detail-label">{t('driverTypes')}:</span>
              <div className="tags">
                {getDriverTypes().map((type, index) => (
                  <span key={index} className="tag">
                    {type}
                  </span>
                ))}
              </div>
            </div>
          )}

          {getTrailerTypes().length > 0 && (
            <div className="detail-row">
              <span className="detail-label">{t('trailerTypes')}:</span>
              <div className="tags">
                {getTrailerTypes().map((type, index) => (
                  <span key={index} className="tag">
                    {type}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="detail-row">
            <span className="detail-label">{t('locations')}:</span>
            <span className="location-count">
              {locationCount} {locationCount === 1 ? t('location') : t('locations')}
            </span>
          </div>
        </div>

        <div className="company-card-footer">
          <button className="apply-btn">{t('viewDetails')}</button>
          {firstLocation?.phone_number && (
            <a
              href={`tel:${firstLocation.phone_number}`}
              className="phone-btn"
              onClick={e => e.stopPropagation()}
            >
              {t('callNow')}
            </a>
          )}
        </div>
      </div>

      <style jsx>{`
        .company-card {
          background: #fff;
          border-radius: 8px;
          padding: 20px;
          margin-bottom: 20px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          border: 1px solid #e9ecef;
          cursor: pointer;
          transition: all 0.3s ease;
          position: relative;
        }
        .company-card:hover {
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
          transform: translateY(-2px);
        }
        .company-card-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 15px;
          gap: 15px;
        }
        .company-info {
          flex-grow: 1;
        }
        .company-name {
          margin: 0 0 5px 0;
          font-size: 20px;
          font-weight: 600;
          color: #333;
          line-height: 1.3;
        }
        .company-location {
          margin: 0;
          color: #666;
          font-size: 14px;
        }
        .pay-rate-badge {
          background: #28a745;
          color: white;
          padding: 6px 12px;
          border-radius: 6px;
          font-size: 12px;
          font-weight: 500;
          white-space: nowrap;
          flex-shrink: 0;
        }
        .company-details {
          margin-bottom: 20px;
        }
        .detail-row {
          display: flex;
          align-items: center;
          margin-bottom: 8px;
          gap: 10px;
          flex-wrap: wrap;
        }
        .detail-label {
          font-weight: 500;
          color: #495057;
          font-size: 14px;
          min-width: 100px;
        }
        .tags {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
        }
        .tag {
          background: #f8f9fa;
          color: #495057;
          padding: 2px 8px;
          border-radius: 12px;
          font-size: 12px;
          border: 1px solid #dee2e6;
        }
        .location-count {
          color: #007bff;
          font-weight: 500;
          font-size: 14px;
        }
        .company-card-footer {
          display: flex;
          gap: 10px;
          align-items: center;
        }
        .apply-btn {
          background: #007bff;
          color: white;
          border: none;
          padding: 8px 16px;
          border-radius: 6px;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: background 0.3s ease;
        }
        .apply-btn:hover {
          background: #0056b3;
        }
        .phone-btn {
          background: #28a745;
          color: white;
          padding: 8px 16px;
          border-radius: 6px;
          font-size: 14px;
          font-weight: 500;
          text-decoration: none;
          transition: background 0.3s ease;
        }
        .phone-btn:hover {
          background: #1e7e34;
          color: white;
        }
        @media (max-width: 768px) {
          .company-card-header {
            flex-direction: column;
            align-items: flex-start;
          }
          .pay-rate-badge {
            align-self: flex-start;
          }
          .detail-row {
            flex-direction: column;
            align-items: flex-start;
            gap: 5px;
          }
          .detail-label {
            min-width: auto;
          }
          .company-card-footer {
            flex-direction: column;
            gap: 8px;
          }
          .apply-btn,
          .phone-btn {
            width: 100%;
            text-align: center;
          }
        }
      `}</style>
    </Link>
  );
};

const CompaniesPage = ({ companies }) => {
  const { t } = useTranslation(['companies', 'index']);
  const { locale } = useRouter();

  const pageTitle = t('pageTitle');
  const pageDescription = t('pageDescription');
  const showQuiz = locale === 'ru' || locale === 'uk';

  // ItemList Schema for Companies
  const companiesListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: pageTitle,
    description: pageDescription,
    url: `https://www.cdlhelp.com${locale === 'en' ? '' : `/${locale}`}/companies`,
    inLanguage: locale,
    numberOfItems: companies.length,
    itemListElement: companies.slice(0, 10).map((company, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'Organization',
        name: company.attributes.name,
        url: `https://www.cdlhelp.com${locale === 'en' ? '' : `/${locale}`}/company/${company.attributes.slug}`,
        description:
          company.attributes.description || `${company.attributes.name} trucking company`,
      },
    })),
  };

  return (
    <>
      <SEOHead title={pageTitle} description={pageDescription} type="article" />

      <Head>
        {/* Companies List Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(companiesListSchema) }}
        />
      </Head>

      <Layout>
        <Navbar />
        <PageBannerStyle1
          pageTitle={t('companiesTitle')}
          homePageUrl="/"
          homePageText={t('homePageText')}
          activePageText={t('companiesTitle')}
        />

        <div className="container pb-100">
          <div className="companies-layout">
            <main className="main-content">
              <div className="companies-header">
                <h2>{t('companiesTitle')}</h2>
                <p className="companies-subtitle">
                  {t('companiesSubtitle', { count: companies.length })}
                </p>
              </div>

              <div className="companies-grid">
                {companies.map(company => (
                  <CompanyCard key={company.id} company={company} />
                ))}
              </div>

              {companies.length === 0 && (
                <div className="no-companies">
                  <h2>{t('noCompaniesTitle')}</h2>
                  <p>{t('noCompaniesText')}</p>
                </div>
              )}
            </main>

            {showQuiz && (
              <aside className="sidebar">
                <div className="quiz-container">
                  <h2 style={{ textAlign: 'center', marginBottom: '1rem', fontSize: '1.5rem' }}>
                    {t('companies:tryPermitQuiz')}
                  </h2>
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

        <RelatedLinks currentPage="companies" />
        <Footer />
      </Layout>
      <style jsx>{`
        .companies-layout {
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
        .companies-header {
          margin-bottom: 30px;
        }
        .companies-header h2 {
          margin: 0 0 10px 0;
          font-size: 32px;
          color: #333;
        }
        .companies-subtitle {
          margin: 0;
          color: #666;
          font-size: 16px;
        }
        .companies-grid {
          display: grid;
          gap: 0;
        }
        .no-companies {
          text-align: center;
          padding: 60px 20px;
          background: #f8f9fa;
          border-radius: 8px;
        }
        .no-companies h2 {
          margin: 0 0 15px 0;
          color: #333;
          font-size: 24px;
        }
        .no-companies p {
          margin: 0;
          color: #666;
          font-size: 16px;
        }
        @media (max-width: 991px) {
          .companies-layout {
            flex-direction: column;
          }
          .sidebar {
            width: 100%;
            margin-bottom: 2rem;
          }
          .companies-header h2 {
            font-size: 28px;
          }
        }
      `}</style>
    </>
  );
};

export async function getStaticProps({ locale }) {
  try {
    const { data: companiesData } = await axios.get(
      `http://${process.env.STRAPI_HOST}:${process.env.STRAPI_PORT}/api/companies?populate[company_locations]=*&sort=createdAt:desc`,
      {
        headers: { Authorization: `Bearer ${process.env.STRAPI_API_KEY}` },
      }
    );

    const companies = companiesData.data || [];

    // Shuffle companies to show random order
    const shuffledCompanies = companies.sort(() => Math.random() - 0.5);

    return {
      props: {
        companies: shuffledCompanies,
        ...(await serverSideTranslations(locale ?? 'en', [
          'navbar',
          'footer',
          'common',
          'companies',
          'index',
        ])),
      },
      revalidate: 300, // Revalidate every 5 minutes to get new random order
    };
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error(
        'Error fetching companies:',
        error.response ? error.response.data : error.message
      );
    }
    return {
      props: {
        companies: [],
        ...(await serverSideTranslations(locale ?? 'en', [
          'navbar',
          'footer',
          'common',
          'companies',
          'index',
        ])),
      },
      revalidate: 60,
    };
  }
}

export default CompaniesPage;
