import React, { useEffect } from 'react';
import Image from 'next/image';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Layout from '../components/_App/Layout';
import Navbar from '../components/_App/Navbar';
import Footer from '../components/_App/Footer';
import { SEOHead } from '../src/shared/ui/SEO';
import { useSEO } from '../src/shared/lib/hooks/useSEO';
import getMeta from '../lib/getMeta';
import analytics from '../lib/analytics';
import attribution from '../lib/attribution';
import { getLocalizedOrganizationName, getLocalizedUrl } from '../lib/schemaLocalization';

const DownloadPage = ({ alternateLinks }) => {
  const { t } = useTranslation('download');
  const router = useRouter();
  const { locale } = router;

  const seoData = useSEO({
    meta: {
      title: t('pageTitle'),
      description: t('pageDescription'),
    },
    customUrl: `https://www.cdlhelp.com${locale === 'en' ? '' : `/${locale}`}/download`,
    type: 'website',
    image: '/images/cdlhelp-tag.jpg',
  });

  useEffect(() => {
    // Initialize analytics
    analytics.init();

    // Track page view with custom parameters
    analytics.trackPageView('/download', t('pageTitle'));

    // Store attribution parameters from URL
    const params = attribution.buildAttributionParams();
    attribution.storeAttributionParams(params);

    // Set user properties
    analytics.setUserProperties({
      locale: locale,
      landing_page: 'download',
      device_type: attribution.getDeviceType(),
    });
  }, [locale, t]);

  const handleDownloadClick = platform => {
    // Track download intent with enhanced analytics
    analytics.trackDownloadIntent(platform, 'download_page', {
      button_location: 'hero',
      locale: locale,
    });

    // Redirect to OneLink for both platforms
    window.location.href = 'https://cdlhelp.onelink.me/mHbW/mgvvp96d';
  };

  const features = [
    {
      icon: '🌐',
      title: t('multilingualSupport'),
      description: t('multilingualSupportDesc'),
    },
    {
      icon: '📚',
      title: t('comprehensiveQuestions'),
      description: t('comprehensiveQuestionsDesc'),
    },
    {
      icon: '🎯',
      title: t('examSimulation'),
      description: t('examSimulationDesc'),
    },
  ];

  // Mobile Application Schema with localization
  const applicationSchema = {
    '@context': 'https://schema.org',
    '@type': 'MobileApplication',
    name: `${getLocalizedOrganizationName(locale)} - CDL Practice Test`,
    description: t('heroDescription'),
    applicationCategory: 'EducationApplication',
    operatingSystem: 'Android, iOS',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.8',
      ratingCount: '2500',
    },
    provider: {
      '@type': 'Organization',
      name: getLocalizedOrganizationName(locale),
      url: getLocalizedUrl(locale),
    },
    inLanguage: locale,
    url: getLocalizedUrl(locale, '/download'),
  };

  // Course Schema with localization (excluding 'teaches' property)
  const courseSchema = {
    '@context': 'https://schema.org',
    '@type': 'Course',
    name: t('pageTitle'),
    description: t('pageDescription'),
    provider: {
      '@type': 'Organization',
      name: getLocalizedOrganizationName(locale),
      url: getLocalizedUrl(locale),
    },
    educationalLevel: 'Professional Certification',
    // 'teaches' property kept in English as requested
    teaches: [
      'CDL General Knowledge',
      'Air Brakes',
      'Combination Vehicles',
      'Hazmat',
      'Doubles/Triples',
      'Tanker',
      'Passenger',
    ],
    hasCourseInstance: {
      '@type': 'CourseInstance',
      courseMode: 'Online',
      inLanguage: locale,
    },
    inLanguage: locale,
    url: getLocalizedUrl(locale, '/download'),
  };

  return (
    <>
      <SEOHead {...seoData} alternateLinks={alternateLinks} />

      <Head>
        {/* Mobile Application Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(applicationSchema) }}
        />

        {/* Course Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(courseSchema) }}
        />
      </Head>

      <Layout>
        <Navbar alternateLinks={alternateLinks} />

        {/* Hero Section */}
        <div className="download-hero-area">
          <div className="container">
            <div className="row align-items-center min-vh-100 pt-5">
              <div className="col-lg-6 col-md-12">
                <div className="download-hero-content">
                  <h1 className="display-3 fw-bold mb-4">{t('heroTitle')}</h1>
                  <p className="lead mb-5">{t('heroDescription')}</p>

                  {/* Download Buttons */}
                  <div className="download-buttons d-flex flex-column flex-sm-row gap-3">
                    <a
                      href="https://play.google.com/store/apps/details?id=help.truckdriver.cdlhelp"
                      onClick={e => {
                        e.preventDefault();
                        handleDownloadClick('android');
                      }}
                      className="btn-download-primary d-flex align-items-center justify-content-center"
                      aria-label={t('downloadAndroid')}
                    >
                      <div
                        className="d-flex align-items-center justify-content-center me-3"
                        style={{ width: '30px', height: '30px' }}
                      >
                        <Image
                          src="/images/play-store.png"
                          alt="Google Play Store"
                          width={27}
                          height={30}
                          style={{ objectFit: 'contain', display: 'block' }}
                        />
                      </div>
                      <div className="text-start">
                        <div
                          className="small text-uppercase"
                          style={{ fontSize: '10px', opacity: 0.8 }}
                        >
                          {t('getItOn')}
                        </div>
                        <div className="fw-bold" style={{ fontSize: '16px', lineHeight: '1.2' }}>
                          Google Play
                        </div>
                      </div>
                    </a>

                    <a
                      href="https://apps.apple.com/us/app/cdl-help/id6444388755"
                      onClick={e => {
                        e.preventDefault();
                        handleDownloadClick('ios');
                      }}
                      className="btn-download-primary d-flex align-items-center justify-content-center"
                      aria-label={t('downloadIOS')}
                    >
                      <div
                        className="d-flex align-items-center justify-content-center me-3"
                        style={{ width: '35px', height: '35px' }}
                      >
                        <Image
                          src="/images/apple-store.png"
                          alt="Apple App Store"
                          width={34}
                          height={35}
                          style={{ objectFit: 'contain', display: 'block' }}
                        />
                      </div>
                      <div className="text-start">
                        <div
                          className="small text-uppercase"
                          style={{ fontSize: '10px', opacity: 0.8 }}
                        >
                          {t('downloadOn')}
                        </div>
                        <div className="fw-bold" style={{ fontSize: '16px', lineHeight: '1.2' }}>
                          App Store
                        </div>
                      </div>
                    </a>
                  </div>

                  {/* Stats */}
                  <div className="download-stats mt-5">
                    <div className="row g-4">
                      <div className="col-4">
                        <h3 className="mb-0">50K+</h3>
                        <p className="text-muted mb-0">{t('downloads')}</p>
                      </div>
                      <div className="col-4">
                        <h3 className="mb-0">4.8★</h3>
                        <p className="text-muted mb-0">{t('rating')}</p>
                      </div>
                      <div className="col-4">
                        <h3 className="mb-0">8</h3>
                        <p className="text-muted mb-0">{t('languages')}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-lg-6 col-md-12">
                <div className="download-hero-image text-center">
                  <Image
                    src="/images/home-7-8-9/app-download/download-2.png"
                    alt={t('appScreenshot')}
                    width={634}
                    height={634}
                    priority
                    className="img-fluid"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <section className="download-features-area ptb-100 bg-light" style={{ marginBottom: '0' }}>
          <div className="container">
            <div className="section-title text-center">
              <h2 className="mb-3">{t('whyChooseTitle')}</h2>
              <p className="lead">{t('whyChooseDescription')}</p>
            </div>

            <div className="row g-4 mt-5">
              {features.map((feature, index) => (
                <div key={index} className="col-lg-4 col-md-6">
                  <div className="download-feature-card h-100">
                    <div className="feature-icon">{feature.icon}</div>
                    <h4>{feature.title}</h4>
                    <p>{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <Footer />
      </Layout>

      <style jsx>{`
        .download-hero-area {
          background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
          position: relative;
          overflow: hidden;
        }

        .download-hero-content h1 {
          color: #2c3e50;
          line-height: 1.2;
        }

        .btn-download-primary {
          background-color: #000;
          color: #fff;
          padding: 12px 24px;
          border-radius: 10px;
          text-decoration: none;
          transition: all 0.3s ease;
          min-width: 220px;
          height: auto;
          min-height: 60px;
          overflow: visible;
          position: relative;
        }

        .btn-download-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
          color: #fff;
        }

        .download-stats h3 {
          color: #2c3e50;
          font-weight: 700;
        }

        .download-feature-card {
          background: #fff;
          padding: 30px;
          border-radius: 10px;
          text-align: center;
          transition: all 0.3s ease;
          height: 100%;
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.08);
        }

        .download-feature-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 15px 30px rgba(0, 0, 0, 0.15);
        }

        .feature-icon {
          font-size: 48px;
          margin-bottom: 20px;
        }

        .download-feature-card h4 {
          color: #2c3e50;
          margin-bottom: 15px;
        }

        @media (max-width: 768px) {
          .download-hero-content h1 {
            font-size: 2rem;
          }

          .btn-download-primary {
            width: 100%;
          }
        }
      `}</style>
    </>
  );
};

export async function getStaticProps({ locale }) {
  const meta = await getMeta(locale, 'general');

  const alternateLinks = {
    en: '/download',
    ar: '/ar/download',
    ru: '/ru/download',
    uk: '/uk/download',
    ko: '/ko/download',
    zh: '/zh/download',
    tr: '/tr/download',
    pt: '/pt/download',
  };

  return {
    props: {
      meta,
      alternateLinks,
      ...(await serverSideTranslations(locale ?? 'en', ['navbar', 'footer', 'cookie', 'download'])),
    },
    revalidate: 300,
  };
}

export default DownloadPage;
