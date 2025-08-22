import React from 'react';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';

import Layout from '../../components/_App/Layout';
import Navbar from '../../components/_App/Navbar';
import Footer from '../../components/_App/Footer';
import PageBannerStyle1 from '../../components/Common/PageBannerStyle1';
import { StateSelector } from '../../src/widgets/StateSelector';
import { SEOHead } from '../../src/shared/ui/SEO';
import { SchemaBuilder } from '../../src/shared/ui/SEO/schemas';
import { StructuredData } from '../../src/shared/ui/SEO/StructuredData';
import { useSEO } from '../../src/shared/lib/hooks/useSEO';
import getMeta from '../../lib/getMeta';
import { getLocalizedOrganizationName, getLocalizedUrl } from '../../lib/schemaLocalization';

const SchoolsPage = ({ meta, states }) => {
  const { t } = useTranslation(['city-schools', 'common']);
  const router = useRouter();
  const { locale } = router;

  const seoData = useSEO({
    meta,
    customUrl: `https://www.cdlhelp.com${locale === 'en' ? '' : `/${locale}`}/schools`,
    type: 'article',
  });

  // Build comprehensive schemas for schools directory page
  const schemas = new SchemaBuilder(locale)
    .addOrganization({
      description: 'CDL Help - Free CDL practice tests and trucking school directory',
    })
    .addWebsite({
      description: 'Find CDL truck driving schools near you',
    })
    .addBreadcrumb([
      { name: t('common:home', 'Home'), url: '/' },
      { name: t('schoolsTitle', 'CDL Schools'), url: '/schools' },
    ])
    .addWebPage({
      name: t('schoolsTitle', 'CDL Schools in USA'),
      description: t(
        'pageDescription',
        'Directory of CDL truck driving schools across the United States. Find certified trucking schools near you.'
      ),
      url: getLocalizedUrl(locale, '/schools'),
      datePublished: '2023-01-01',
      dateModified: new Date().toISOString(),
    })
    .addItemList({
      name: t('schoolsTitle', 'CDL Schools Directory'),
      description: t(
        'pageDescription',
        'Complete list of CDL truck driving schools organized by state'
      ),
      url: getLocalizedUrl(locale, '/schools'),
      numberOfItems: states.length,
      itemListElement: states.slice(0, 10).map((state, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: `CDL Schools in ${state.name}`,
        url: `${getLocalizedUrl(locale, '/schools')}/${state.slug}`,
        item: {
          '@type': 'WebPage',
          name: `CDL Schools in ${state.name}`,
          url: `${getLocalizedUrl(locale, '/schools')}/${state.slug}`,
        },
      })),
    })
    .addCourse({
      name: 'CDL Training Programs',
      description: 'Professional truck driver training programs available across the United States',
      teaches: [
        'CDL Class A License',
        'CDL Class B License',
        'Pre-Trip Inspection',
        'Backing and Parking',
        'Road Driving',
        'Safety Regulations',
      ],
      educationalLevel: 'Professional Certification',
      educationalCredentialAwarded: 'Commercial Driver License (CDL)',
    })
    .build();

  return (
    <>
      <SEOHead {...seoData} />

      {/* Structured Data Schemas */}
      <StructuredData data={schemas} />

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
