import React from 'react';
import ContactForm from '../components/Contact/ContactForm';
import ContactInfo from '../components/Contact/ContactInfo';
import ContactIntro from '../components/Contact/ContactIntro';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Footer from '../components/_App/Footer';
import Navbar from '../components/_App/Navbar';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import Image from 'next/image';
import { SEOHead } from '../src/shared/ui/SEO';
import { SchemaBuilder } from '../src/shared/ui/SEO/schemas';
import { StructuredData } from '../src/shared/ui/SEO/StructuredData';
import getMeta from '../lib/getMeta';

const Contact = ({ alternateLinks, meta }) => {
  const { t } = useTranslation('contact');
  const router = useRouter();
  const { locale } = router;

  // Build comprehensive schemas for contact page
  const schemas = new SchemaBuilder(locale)
    .addOrganization({
      description: 'CDL Help - Free CDL practice tests and trucking resources',
      contactPoint: {
        '@type': 'ContactPoint',
        contactType: 'customer support',
        email: 'support@cdlhelp.com',
        availableLanguage: [
          'English',
          'Russian',
          'Ukrainian',
          'Arabic',
          'Korean',
          'Chinese',
          'Turkish',
          'Portuguese',
        ],
      },
    })
    .addWebsite({
      description: 'Contact CDL Help for support and assistance',
    })
    .addBreadcrumb([
      { name: t('home', 'Home'), url: '/' },
      { name: t('contact', 'Contact'), url: '/contact' },
    ])
    .addContactPage({
      name: t('pageTitle', 'Contact CDL Help'),
      description: t(
        'pageDescription',
        'Get in touch with CDL Help. We are here to help you with your CDL test preparation and answer any questions.'
      ),
      url: `https://www.cdlhelp.com${locale === 'en' ? '' : `/${locale}`}/contact`,
      mainEntity: {
        '@type': 'Organization',
        name: 'CDL Help',
        url: 'https://www.cdlhelp.com',
        email: 'support@cdlhelp.com',
        contactPoint: {
          '@type': 'ContactPoint',
          contactType: 'customer support',
          email: 'support@cdlhelp.com',
          availableLanguage: [
            'English',
            'Russian',
            'Ukrainian',
            'Arabic',
            'Korean',
            'Chinese',
            'Turkish',
            'Portuguese',
          ],
        },
      },
    })
    .build();

  return (
    <>
      <SEOHead
        title={meta.title || t('pageTitle', 'Contact Us - CDL Help')}
        description={
          meta.description ||
          t(
            'pageDescription',
            'Get in touch with CDL Help. We are here to help you with your CDL test preparation.'
          )
        }
        alternateLinks={alternateLinks}
      />

      {/* Structured Data Schemas */}
      <StructuredData data={schemas} />

      <Navbar alternateLinks={alternateLinks} />

      <div className="page-title-area">
        <div className="container">
          <div className="page-title-content">
            <h1>{t('support')}</h1>
          </div>
        </div>
        <div className="banner-shape1">
          <Image src="/images/shape/shape9.png" alt="image" width={100} height={100} />
        </div>
      </div>

      <ContactInfo />
      <ContactForm />
      <ContactIntro />
      <Footer />
    </>
  );
};

export default Contact;

export async function getStaticProps({ locale }) {
  const alternateLinks = {
    en: '/contact',
    ar: '/ar/contact',
    ru: '/ru/contact',
    uk: '/uk/contact',
    zh: '/zh/contact',
    ko: '/ko/contact',
    tr: '/tr/contact',
    pt: '/pt/contact',
  };

  const meta = await getMeta(locale, 'contact');

  return {
    props: {
      alternateLinks,
      meta,
      ...(await serverSideTranslations(locale ?? 'en', ['navbar', 'footer', 'cookie', 'contact'])),
    },
  };
}
