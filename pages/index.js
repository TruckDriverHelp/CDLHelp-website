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

  // Organization Schema with localization
  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: getLocalizedOrganizationName(locale),
    alternateName: getLocalizedAlternateName(locale),
    url: getLocalizedUrl(locale),
    logo: 'https://www.cdlhelp.com/images/black-logo.png',
    sameAs: getLocalizedSocialLinks(locale),
  };

  // WebSite Schema with localization
  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    url: getLocalizedUrl(locale),
    name: getLocalizedOrganizationName(locale),
    description: getLocalizedDescription(locale, t),
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${getLocalizedUrl(locale)}/search?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
    inLanguage: locale,
    publisher: {
      '@type': 'Organization',
      name: getLocalizedOrganizationName(locale),
      logo: {
        '@type': 'ImageObject',
        url: 'https://www.cdlhelp.com/images/black-logo.png',
      },
    },
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
