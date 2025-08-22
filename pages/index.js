import React from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import getMeta from '../lib/getMeta';
import Navbar from '../components/_App/Navbar';
import Footer from '../components/_App/Footer';
import Layout from '../components/_App/Layout';
import { useTranslation } from 'next-i18next';
import { DynamicFaqSection } from '../components/_App/DynamicImports';
import { SEOHead } from '../src/shared/ui/SEO';
import dynamic from 'next/dynamic';
import TopContainer from '../components/Home/TopContainer'; // Import directly for LCP performance
import { SchemaBuilder } from '../src/shared/ui/SEO/schemas';
import { StructuredData } from '../src/shared/ui/SEO/StructuredData';
import { defaultCDLFAQs } from '../components/Schema/FAQSchema';
import {
  getLocalizedOrganizationName,
  getLocalizedAlternateName,
  getLocalizedDescription,
  getLocalizedUrl,
  getLocalizedSocialLinks,
} from '../lib/schemaLocalization';

// Lazy load non-critical components
const AppIntroVideo = dynamic(() => import('../components/Home/AppIntroVideo'), {
  loading: () => <div style={{ minHeight: '300px', background: '#f5f5f5' }}>Loading video...</div>,
  ssr: true,
});

const Funfacts = dynamic(() => import('../components/Home/Funfacts'), {
  loading: () => (
    <div style={{ minHeight: '150px', background: '#f5f5f5' }}>Loading fun facts...</div>
  ),
  ssr: true,
});

const AppDownload = dynamic(() => import('../components/Home/AppDownload'), {
  loading: () => (
    <div style={{ minHeight: '200px', background: '#f5f5f5' }}>Loading download section...</div>
  ),
  ssr: true,
});

const IndexPage = ({ meta, alternateLinks }) => {
  const { locale } = useRouter();
  const { t } = useTranslation('index');

  // Get localized OG image
  const getOGImage = () => {
    if (locale && locale !== 'en') {
      return `/images/og/og-default-${locale}.jpg`;
    }
    return '/images/og/og-default.jpg';
  };

  // Build all schemas using the centralized SchemaBuilder
  const schemas = new SchemaBuilder(locale)
    .addOrganization({
      description: getLocalizedDescription(locale, t),
    })
    .addWebsite({
      description: getLocalizedDescription(locale, t),
    })
    .addBreadcrumb([{ name: t('home'), url: '/' }])
    .addCourse({
      name: t('cdl_practice_test', 'CDL Practice Test'),
      description: t(
        'course_description',
        "Free CDL practice tests to help you pass your Commercial Driver's License exam"
      ),
      aggregateRating: { ratingValue: 4.8, reviewCount: 15000 },
      educationalCredentialAwarded: 'CDL Permit Certificate',
      totalHistoricalEnrollment: 500000,
      learningOutcome: [
        'Pass CDL General Knowledge test',
        'Master Air Brakes examination',
        'Complete Hazmat certification',
        'Achieve CDL permit',
      ],
    })
    .addFAQ({
      questions: defaultCDLFAQs.map(faq => ({
        question: faq.question,
        answer: faq.answer,
        dateCreated: '2024-01-01T00:00:00Z',
        author: 'CDL Help Team',
      })),
    })
    .build();

  return (
    <>
      <SEOHead
        title={meta.title || t('title')}
        description={locale === 'en' ? t('description') : meta.description || t('description')}
        url={`https://www.cdlhelp.com${locale === 'en' ? '' : `/${locale}`}`}
        canonical={`https://www.cdlhelp.com${locale === 'en' ? '' : `/${locale}`}`}
        image={getOGImage()}
        type="website"
        alternateLinks={alternateLinks}
        keywords={[
          'CDL practice test',
          'CDL permit test',
          'CDL study guide',
          'commercial drivers license',
          'CDL exam',
          'CDL app',
        ]}
      />

      <Head>
        {/* Preconnect to external domains */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />

        {/* Preload critical assets - specific to homepage */}
        <link
          rel="preload"
          href="/images/video/video-3-no-text.webp"
          as="image"
          type="image/webp"
        />

        {/* Preconnect to Google Fonts */}
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />

        {/* Preload critical fonts */}
        <link
          rel="preload"
          as="font"
          type="font/woff2"
          href="https://fonts.gstatic.com/s/inter/v13/UcC73FwrK3iLTeHuS_fvQtMwCp50KnMa1pL7SUc.woff2"
          crossOrigin="anonymous"
        />

        {/* All schemas handled by StructuredData component */}
      </Head>

      {/* Structured Data Schemas */}
      <StructuredData data={schemas} />

      {/* All schemas are now handled by the centralized StructuredData component above */}

      <Layout>
        <Navbar alternateLinks={alternateLinks} />
        <TopContainer />
        <AppIntroVideo />
        <Funfacts />
        <AppDownload />
        <DynamicFaqSection />
        <Footer />
      </Layout>
    </>
  );
};

export default IndexPage;

export async function getStaticProps({ locale }) {
  const meta = await getMeta(locale, 'home-title');

  const alternateLinks = {
    en: '/',
    ar: '/ar',
    ru: '/ru',
    uk: '/uk',
    zh: '/zh',
    ko: '/ko',
    tr: '/tr',
    pt: '/pt',
  };

  return {
    props: {
      meta: meta,
      alternateLinks: alternateLinks,
      ...(await serverSideTranslations(locale ?? 'en', ['index', 'navbar', 'footer', 'cookie'])),
    },
    revalidate: 900, // Revalidate every 15 minutes for homepage
  };
}
