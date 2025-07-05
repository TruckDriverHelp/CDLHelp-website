import React from 'react';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import Head from 'next/head';

import Layout from '../../components/_App/Layout';
import Navbar from '../../components/_App/Navbar';
import Footer from '../../components/_App/Footer';
import PageBannerStyle1 from '../../components/Common/PageBannerStyle1';
import { StateSelector } from '../../src/widgets/StateSelector';
import { SEOHead } from '../../src/shared/ui/SEO';
import { useSEO } from '../../src/shared/lib/hooks/useSEO';
import getMeta from '../../lib/getMeta';
import { getLocalizedOrganizationName, getLocalizedUrl } from '../../lib/schemaLocalization';

const SchoolsPage = ({ meta, states }) => {
  const { t } = useTranslation(['city-schools', 'common']);
  const router = useRouter();
  const { locale } = router;

  const seoData = useSEO({
    meta,
    customUrl: `https://www.cdlhelp.com${locale === 'en' ? '' : `/${locale}`}/cdl-schools`,
    type: 'article',
  });

  // ItemList Schema for CDL Schools with localization
  const itemListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: t('schoolsTitle', 'CDL Schools in USA'),
    description: t(
      'pageDescription',
      'Directory of CDL truck driving schools across the United States'
    ),
    url: getLocalizedUrl(locale, '/cdl-schools'),
    numberOfItems: states.length,
    inLanguage: locale,
    publisher: {
      '@type': 'Organization',
      name: getLocalizedOrganizationName(locale),
      url: getLocalizedUrl(locale),
      logo: {
        '@type': 'ImageObject',
        url: 'https://www.cdlhelp.com/images/black-logo.png',
      },
    },
  };

  return (
    <>
      <SEOHead {...seoData} />

      <Head>
        {/* ItemList Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
        />
      </Head>

      <Layout alternateLinks={{}} dir="ltr">
        <Navbar alternateLinks={{}} />

        <PageBannerStyle1
          pageTitle={t('schoolsTitle', 'CDL Schools in USA')}
          homePageUrl="/"
          homePageText={t('common:home', 'Home')}
          activePageText={t('schoolsTitle', 'CDL Schools in USA')}
        />

        <div
          style={{
            backgroundColor: '#f8fafc',
            minHeight: 'calc(100vh - 200px)',
            paddingBottom: '100px',
          }}
        >
          <div className="container">
            {/* States Section */}
            <div style={{ marginTop: '60px' }}>
              <StateSelector states={states} />
            </div>
          </div>
        </div>

        <Footer />
      </Layout>
    </>
  );
};

export async function getStaticProps({ locale }) {
  try {
    // Import function dynamically for server-side
    const { fetchStatesWithCities } = await import('../../src/entities/School/api/schoolApi');

    const [meta, states] = await Promise.all([
      getMeta(locale || 'en', 'general'),
      fetchStatesWithCities(),
    ]);

    return {
      props: {
        meta,
        states,
        ...(await serverSideTranslations(locale ?? 'en', [
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
    console.error('Error in getStaticProps:', error);

    // Fallback to mock data in case of error
    const meta = await getMeta(locale || 'en', 'general');

    return {
      props: {
        meta,
        states: [],
        ...(await serverSideTranslations(locale ?? 'en', [
          'navbar',
          'footer',
          'common',
          'city-schools',
          'index',
        ])),
      },
      revalidate: 300,
    };
  }
}

export default SchoolsPage;
