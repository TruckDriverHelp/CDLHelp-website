import React from 'react';
import ContactForm from '../components/Contact/ContactForm';
import ContactInfo from '../components/Contact/ContactInfo';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Footer from '../components/_App/Footer';
import Navbar from '../components/_App/Navbar';
import { useTranslation } from 'next-i18next';
import { SEOHead } from '../src/shared/ui/SEO';
import getMeta from '../lib/getMeta';

const Contact = ({ alternateLinks, meta }) => {
  const { t } = useTranslation('contact');
  return (
    <>
      <SEOHead
        title={meta.title || t('pageTitle', 'Contact Us - CDL Help')}
        description={meta.description || t('pageDescription', 'Get in touch with CDL Help. We are here to help you with your CDL test preparation.')}
        alternateLinks={alternateLinks}
      />
      <Navbar alternateLinks={alternateLinks} />

      <div className="page-title-area">
        <div className="container">
          <div className="page-title-content">
            <h1>{t('support')}</h1>
          </div>
        </div>
        <div className="banner-shape1">
          <img src="/images/shape/shape9.png" alt="image" />
        </div>
      </div>

      <ContactForm />
      <ContactInfo />
      <Footer />
    </>
  );
};

export default Contact;

export async function getStaticProps({ locale }) {
  const alternateLinks = {
    'en': '/contact',
    'ar': '/ar/contact',
    'ru': '/ru/contact',
    'uk': '/uk/contact',
    'zh': '/zh/contact',
    'ko': '/ko/contact',
    'tr': '/tr/contact',
    'pt': '/pt/contact'
  };

  const meta = await getMeta(locale, "contact");

  return {
    props: {
      alternateLinks,
      meta,
      ...(await serverSideTranslations(locale ?? 'en', [
        'navbar',
        'footer',
        'cookie',
        'contact',
      ])),
    },
  };
}
