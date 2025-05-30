import React from 'react';
import ContactForm from '../components/Contact/ContactForm';
import ContactInfo from '../components/Contact/ContactInfo';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Footer from '../components/_App/Footer';
import Navbar from '../components/_App/Navbar';
import Head from 'next/head';
import { useTranslation } from 'next-i18next';
import getMeta from '../lib/getMeta';

const Contact = ({ alternateLinks, meta }) => {
  const { t } = useTranslation('contact');
  return (
    <>
      <Head>
        {alternateLinks.map((link, index) => (
          <link
            key={index}
            rel="alternate"
            href={process.env.BASE_URL + link.href}
            hrefLang={link.hrefLang}
          />
        ))}
        <title>{meta.title}</title>
        <meta name="description" content={meta.description} />
      </Head>
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
  const alternateLinks = [
    { href: '/en/contact/', hrefLang: 'x-default' },
    { href: '/ar/contact/', hrefLang: 'ar' },
    { href: '/ru/contact/', hrefLang: 'ru' },
    { href: '/uk/contact/', hrefLang: 'uk' },
    { href: '/zh/contact/', hrefLang: 'zh' },
    { href: '/ko/contact/', hrefLang: 'ko' },
    { href: '/tr/contact/', hrefLang: 'tr' },
    { href: '/en/contact/', hrefLang: 'en' },
  ];

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
