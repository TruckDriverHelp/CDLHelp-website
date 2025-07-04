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

// Dynamically import non-critical components
const TopContainer = dynamic(() => import('../components/Home/TopContainer'), {
  loading: () => <div style={{ minHeight: '400px', background: '#f5f5f5' }}>Loading...</div>,
  ssr: true,
});

// Preload critical components
// const BestFeatures = dynamic(() => import('../components/Home/BestFeatures'), {
//   loading: () => (
//     <div style={{ minHeight: '200px', background: '#f5f5f5' }}>Loading features...</div>
//   ),
//   ssr: false,
// });

// Lazy load non-critical components
const AppIntroVideo = dynamic(() => import('../components/Home/AppIntroVideo'), {
  loading: () => <div style={{ minHeight: '300px', background: '#f5f5f5' }}>Loading video...</div>,
  ssr: false,
});

const Funfacts = dynamic(() => import('../components/Home/Funfacts'), {
  loading: () => (
    <div style={{ minHeight: '150px', background: '#f5f5f5' }}>Loading fun facts...</div>
  ),
  ssr: false,
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

  // Organization Schema
  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'CDL Help',
    alternateName: 'Truck Driver Help',
    url: 'https://www.cdlhelp.com',
    logo: 'https://www.cdlhelp.com/images/black-logo.png',
    sameAs: [
      'https://www.facebook.com/cdlhelp',
      'https://twitter.com/cdlhelp',
      'https://www.youtube.com/cdlhelp',
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+1-800-CDL-HELP',
      contactType: 'customer service',
      areaServed: 'US',
      availableLanguage: [
        'English',
        'Spanish',
        'Russian',
        'Ukrainian',
        'Arabic',
        'Korean',
        'Chinese',
        'Turkish',
        'Portuguese',
      ],
    },
  };

  // WebSite Schema with locale-specific URL
  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    url: `https://www.cdlhelp.com${locale === 'en' ? '' : `/${locale}`}`,
    name: 'CDL Help',
    description: t('description'),
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `https://www.cdlhelp.com${locale === 'en' ? '' : `/${locale}`}/search?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
    inLanguage: locale,
  };

  return (
    <>
      <SEOHead
        title={meta.title || t('title')}
        description={locale === 'en' ? t('description') : meta.description || t('description')}
        url={`https://www.cdlhelp.com${locale === 'en' ? '' : `/${locale}`}`}
        canonical={`https://www.cdlhelp.com${locale === 'en' ? '' : `/${locale}`}`}
        type="website"
        alternateLinks={alternateLinks}
      />

      <Head>
        {/* Preload critical assets - специфичные для главной страницы */}
        <link
          rel="preload"
          href="/images/video/video-3-no-text.webp"
          as="image"
          type="image/webp"
        />

        {/* Organization Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />

        {/* WebSite Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
      </Head>

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
  };
}
