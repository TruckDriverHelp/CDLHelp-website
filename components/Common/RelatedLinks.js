import React from 'react';
import Link from 'next/link';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';

const RelatedLinks = ({ currentPage = '' }) => {
  const { t } = useTranslation(['common', 'navbar', 'footer']);
  const router = useRouter();
  const { locale } = router;

  // Define different link sets based on page type
  const getLinksByPageType = () => {
    // For school pages
    if (currentPage.includes('schools')) {
      return [
        {
          href: '/cdl-texas',
          icon: '📝',
          title: t('navbar:practiceTest', 'Practice Test'),
          desc: t('common:practiceTestDesc', 'Take free CDL practice tests'),
        },
        {
          href: '/pre-trip-inspection/guide',
          icon: '🚛',
          title: t('navbar:preTripInspection', 'Pre-Trip Inspection'),
          desc: t('common:preTripDesc', 'Learn inspection procedures'),
        },
        {
          href: '/companies',
          icon: '🏢',
          title: t('navbar:companies', 'Trucking Companies'),
          desc: t('common:companiesDesc', 'Find trucking companies hiring'),
        },
        {
          href: '/blog',
          icon: '📚',
          title: t('navbar:blog', 'Blog'),
          desc: t('common:blogDesc', 'CDL tips and industry news'),
        },
      ];
    }

    // For companies pages
    if (currentPage.includes('companies')) {
      return [
        {
          href: '/schools',
          icon: '🏫',
          title: t('navbar:schools', 'CDL Schools'),
          desc: t('common:schoolsDesc', 'Find CDL training schools'),
        },
        {
          href: '/cdl-texas',
          icon: '📝',
          title: t('navbar:practiceTest', 'Practice Test'),
          desc: t('common:practiceTestDesc', 'Prepare for your CDL exam'),
        },
        {
          href: '/how-to-get-cdl',
          icon: '📋',
          title: t('navbar:howToGetCDL', 'How to Get CDL'),
          desc: t('common:howToGetCDLDesc', 'Step-by-step CDL guide'),
        },
        {
          href: '/download',
          icon: '📱',
          title: t('navbar:downloadApp', 'Mobile App'),
          desc: t('common:downloadDesc', 'Practice on the go'),
        },
      ];
    }

    // For DOT physical exam pages
    if (currentPage.includes('dot-physical-exam')) {
      return [
        {
          href: '/how-to-get-cdl',
          icon: '📋',
          title: t('navbar:howToGetCDL', 'How to Get CDL'),
          desc: t('common:howToGetCDLDesc', 'CDL requirements guide'),
        },
        {
          href: '/schools',
          icon: '🏫',
          title: t('navbar:schools', 'CDL Schools'),
          desc: t('common:schoolsDesc', 'Find training schools'),
        },
        {
          href: '/cdl-texas',
          icon: '📝',
          title: t('navbar:practiceTest', 'Practice Test'),
          desc: t('common:practiceTestDesc', 'CDL practice exams'),
        },
        {
          href: '/blog',
          icon: '📚',
          title: t('navbar:blog', 'Blog'),
          desc: t('common:blogDesc', 'CDL tips and resources'),
        },
      ];
    }

    // For test/practice pages including road-signs
    if (currentPage.includes('cdl-texas') || currentPage.includes('road-signs')) {
      return [
        {
          href: '/schools',
          icon: '🏫',
          title: t('navbar:schools', 'CDL Schools'),
          desc: t('common:schoolsDesc', 'Find training schools near you'),
        },
        {
          href: '/pre-trip-inspection/guide',
          icon: '🚛',
          title: t('navbar:preTripInspection', 'Pre-Trip Inspection'),
          desc: t('common:preTripDesc', 'Complete inspection guide'),
        },
        {
          href: '/download',
          icon: '📱',
          title: t('navbar:downloadApp', 'Mobile App'),
          desc: t('common:downloadDesc', 'Practice on your phone'),
        },
        {
          href: '/blog',
          icon: '📚',
          title: t('navbar:blog', 'Blog'),
          desc: t('common:blogDesc', 'Tips for passing your CDL test'),
        },
      ];
    }

    // For how-to and guide pages
    if (
      currentPage.includes('how-to') ||
      currentPage.includes('guide') ||
      currentPage.includes('article')
    ) {
      return [
        {
          href: '/cdl-texas',
          icon: '📝',
          title: t('navbar:practiceTest', 'Practice Test'),
          desc: t('common:practiceTestDesc', 'Free CDL practice tests'),
        },
        {
          href: '/schools',
          icon: '🏫',
          title: t('navbar:schools', 'CDL Schools'),
          desc: t('common:schoolsDesc', 'Find CDL schools'),
        },
        {
          href: '/companies',
          icon: '🏢',
          title: t('navbar:companies', 'Companies'),
          desc: t('common:companiesDesc', 'Trucking companies hiring'),
        },
        {
          href: '/download',
          icon: '📱',
          title: t('navbar:downloadApp', 'Mobile App'),
          desc: t('common:downloadDesc', 'CDL practice app'),
        },
      ];
    }

    // Default links for other pages
    return [
      {
        href: '/cdl-texas',
        icon: '📝',
        title: t('navbar:practiceTest', 'Practice Test'),
        desc: t('common:practiceTestDesc', 'Free CDL practice tests'),
      },
      {
        href: '/schools',
        icon: '🏫',
        title: t('navbar:schools', 'CDL Schools'),
        desc: t('common:schoolsDesc', 'Find CDL schools'),
      },
      {
        href: '/pre-trip-inspection/guide',
        icon: '🚛',
        title: t('navbar:preTripInspection', 'Pre-Trip'),
        desc: t('common:preTripDesc', 'Inspection guide'),
      },
      {
        href: '/blog',
        icon: '📚',
        title: t('navbar:blog', 'Blog'),
        desc: t('common:blogDesc', 'CDL resources'),
      },
    ];
  };

  const links = getLinksByPageType();

  return (
    <section className="related-links-section ptb-100">
      <div className="container">
        <div className="section-title text-center">
          <h2 className="mb-3">{t('common:exploreMore', 'Explore More')}</h2>
          <p className="lead">
            {t('common:exploreMoreDesc', 'Discover more resources to help with your CDL journey')}
          </p>
        </div>

        <div className="row g-4 mt-5">
          {links.map((link, index) => (
            <div key={index} className="col-lg-3 col-md-6">
              <Link href={link.href} locale={locale} legacyBehavior>
                <a className="related-link-card h-100 d-block text-decoration-none">
                  <div className="p-4 bg-white rounded shadow-sm h-100">
                    <div className="text-center mb-3">
                      <span style={{ fontSize: '2rem' }}>{link.icon}</span>
                    </div>
                    <h4 className="h5 mb-2" style={{ color: '#2c3e50' }}>
                      {link.title}
                    </h4>
                    <p className="text-muted small mb-0">{link.desc}</p>
                  </div>
                </a>
              </Link>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        .related-link-card:hover .p-4 {
          transform: translateY(-5px);
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15) !important;
        }

        .related-link-card .p-4 {
          transition: all 0.3s ease;
        }

        .related-links-section {
          background-color: #f8f9fa;
        }
      `}</style>
    </section>
  );
};

export default RelatedLinks;
