import React from 'react';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import Link from 'next/link';

import Layout from '../../../components/_App/Layout';
import Navbar from '../../../components/_App/Navbar';
import Footer from '../../../components/_App/Footer';
import PageBannerStyle1 from '../../../components/Common/PageBannerStyle1';
import { SchoolList } from '../../../src/widgets/SchoolList';
import { formatStateName } from '../../../src/shared/lib/utils/formatters';
import { SEOHead } from '../../../src/shared/ui/SEO';
import { useSEO } from '../../../src/shared/lib/hooks/useSEO';
import getMeta from '../../../lib/getMeta';

const CitySchoolsPage = ({ schools, state, city, meta }) => {
  const { t } = useTranslation(['city-schools', 'index']);
  const router = useRouter();
  const { locale } = router;

  const stateFormatted = formatStateName(state);
  const cityFormatted = city.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());

  const seoData = useSEO({
    meta,
    customUrl: `https://www.cdlhelp.com/cdl-schools/${state}/${city}`,
    type: 'article',
  });

  return (
    <>
      <SEOHead {...seoData} />

      <Layout alternateLinks={{}} dir="ltr">
        <Navbar alternateLinks={{}} />

        <PageBannerStyle1
          pageTitle={t('schoolsInCity', {
            city: cityFormatted,
            state: stateFormatted,
            defaultValue: `CDL Schools in ${cityFormatted}, ${stateFormatted}`,
          })}
          homePageUrl="/cdl-schools"
          homePageText={t('schoolsTitle', 'CDL Schools')}
          activePageText={`${cityFormatted}, ${stateFormatted}`}
        />

        <div
          style={{
            backgroundColor: '#f8fafc',
            minHeight: 'calc(100vh - 200px)',
            paddingBottom: '100px',
          }}
        >
          <div
            style={{
              maxWidth: '100%',
              padding: '0 20px',
            }}
          >
            {/* Breadcrumb */}
            <div
              style={{
                padding: '20px 0',
                maxWidth: '1400px',
                margin: '0 auto',
              }}
            >
              <nav
                style={{
                  fontSize: '14px',
                  color: '#6b7280',
                }}
              >
                <Link href="/cdl-schools" locale={locale} legacyBehavior>
                  <a style={{ color: '#3c3d78', textDecoration: 'none' }}>
                    {t('schoolsTitle', 'CDL Schools')}
                  </a>
                </Link>
                <span style={{ margin: '0 8px' }}>›</span>
                <Link href={`/cdl-schools/${state}`} locale={locale} legacyBehavior>
                  <a style={{ color: '#3c3d78', textDecoration: 'none' }}>{stateFormatted}</a>
                </Link>
                <span style={{ margin: '0 8px' }}>›</span>
                <span>{cityFormatted}</span>
              </nav>
            </div>

            {/* Schools Grid */}
            <div
              className="schools-grid"
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
                gap: '24px',
                padding: '20px 0',
                maxWidth: '1400px',
                margin: '0 auto',
              }}
            >
              {schools.map(schoolLocation => (
                <div key={schoolLocation.id}>
                  <SchoolList schools={[schoolLocation]} loading={false} error={null} />
                </div>
              ))}
            </div>

            {schools.length === 0 && (
              <div
                style={{
                  textAlign: 'center',
                  padding: '60px 20px',
                  background: '#fff',
                  borderRadius: '16px',
                  margin: '40px auto',
                  maxWidth: '600px',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                }}
              >
                <h3
                  style={{
                    fontSize: '1.5rem',
                    color: '#374151',
                    marginBottom: '12px',
                  }}
                >
                  {t('noSchoolsTitle', 'No Schools Found')}
                </h3>
                <p
                  style={{
                    color: '#6b7280',
                    fontSize: '1rem',
                  }}
                >
                  {t('noSchoolsInCity', {
                    city: cityFormatted,
                    state: stateFormatted,
                    defaultValue: `No CDL schools are currently available in ${cityFormatted}, ${stateFormatted}.`,
                  })}
                </p>
              </div>
            )}
          </div>
        </div>

        <Footer />
      </Layout>

      <style jsx>{`
        @media (max-width: 768px) {
          .schools-grid {
            grid-template-columns: 1fr !important;
            gap: 16px !important;
            padding: 0 10px !important;
          }
        }
      `}</style>
    </>
  );
};

export async function getStaticPaths() {
  try {
    // Получаем все штаты и их города
    const { fetchStatesWithCities } = await import('../../../src/entities/School/api/schoolApi');
    const states = await fetchStatesWithCities();

    const paths = [];

    // Создаем пути для каждого города в каждом штате
    states.forEach(state => {
      state.cities.forEach(city => {
        // English without locale prefix
        paths.push({
          params: {
            state: state.slug,
            city: city.slug,
          },
          locale: undefined,
        });

        // Other locales with prefix
        const otherLocales = ['ru', 'uk', 'ar', 'ko', 'zh', 'tr', 'pt'];
        otherLocales.forEach(locale => {
          paths.push({
            params: {
              state: state.slug,
              city: city.slug,
            },
            locale,
          });
        });
      });
    });

    return {
      paths,
      fallback: 'blocking',
    };
  } catch (error) {
    return {
      paths: [],
      fallback: 'blocking',
    };
  }
}

export async function getStaticProps({ params, locale }) {
  const { state, city } = params || {};

  if (!state || !city) {
    return {
      notFound: true,
    };
  }

  try {
    // Импортируем функцию динамически для server-side
    const { fetchSchoolsForCity } = await import('../../../src/entities/School/api/schoolApi');

    const stateFormatted = formatStateName(state);
    const cityFormatted = city.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());

    const [meta, schools] = await Promise.all([
      getMeta(locale || 'en', 'general'),
      fetchSchoolsForCity(stateFormatted, cityFormatted),
    ]);

    return {
      props: {
        schools,
        state,
        city,
        meta,
        ...(await serverSideTranslations(locale || 'en', [
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
    const meta = await getMeta(locale || 'en', 'general');

    return {
      props: {
        schools: [],
        state,
        city,
        meta,
        ...(await serverSideTranslations(locale || 'en', [
          'navbar',
          'footer',
          'common',
          'city-schools',
          'index',
        ])),
      },
      revalidate: 60,
    };
  }
}

export default CitySchoolsPage;
