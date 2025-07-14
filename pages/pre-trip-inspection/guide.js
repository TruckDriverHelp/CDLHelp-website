import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import fs from 'fs';
import path from 'path';
import styles from '../../styles/PreTripInspection.module.css';
import { SEOHead } from '../../src/shared/ui/SEO';
import Layout from '../../components/_App/Layout';
import Navbar from '../../components/_App/Navbar';

export default function PreTripGuide({ sections, alternateLinks }) {
  const router = useRouter();
  const { t } = useTranslation(['pre-trip', 'common']);
  // const locale = router.locale;

  const metaTitle = t('guide.title');
  const metaDescription = t('guide.intro');
  const metaImage = '/images/truckdriverhelp-og.jpg'; // You may want to move this to translations as well

  return (
    <>
      <SEOHead
        title={metaTitle}
        description={metaDescription}
        alternateLinks={alternateLinks}
        image={metaImage}
      />
      <Layout>
        <Navbar alternateLinks={alternateLinks} />
      </Layout>
      <div className={styles.guideContainer}>
        <div className={styles.guideHeader}>
          <h1 className={styles.guideTitle}>{t('guide.title')}</h1>
          <div className={styles.guideIntro}>
            <p>{t('guide.intro')}</p>
            <p>{t('guide.when')}</p>
            <p>{t('guide.where')}</p>
          </div>
        </div>

        <div className={styles.sectionsList}>
          {sections.map(section => (
            <div
              key={section.number}
              className={styles.sectionCard}
              onClick={() => router.push(`/pre-trip-inspection/${section.slug}/1`)}
            >
              <div className={styles.sectionNumber}>{section.number}</div>
              <div className={styles.sectionContent}>
                <h3 className={styles.sectionTitle}>{section.name.en}</h3>
                {router.locale !== 'en' && (
                  <p className={styles.sectionSubtitle}>{section.name.ru}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export async function getStaticProps({ locale }) {
  const preTripDir = path.join(process.cwd(), 'data/pre-trip');
  const files = fs.readdirSync(preTripDir);
  const alternateLinks = {
    en: '/pre-trip-inspection/guide',
    ar: '/ar/pre-trip-inspection/guide',
    ru: '/ru/pre-trip-inspection/guide',
    uk: '/uk/pre-trip-inspection/guide',
    zh: '/zh/pre-trip-inspection/guide',
    ko: '/ko/pre-trip-inspection/guide',
    tr: '/tr/pre-trip-inspection/guide',
    pt: '/pt/pre-trip-inspection/guide',
  };

  const sections = files
    .map(file => {
      const fileNumber = parseInt(file.split('-')[0]);
      const fileSlug = file.split('-').slice(1).join('-').replace('.json', '');
      const fileContents = fs.readFileSync(path.join(preTripDir, file), 'utf8');
      const data = JSON.parse(fileContents);

      return {
        number: fileNumber,
        slug: fileSlug,
        name: data.name,
      };
    })
    .sort((a, b) => a.number - b.number);

  return {
    props: {
      alternateLinks: alternateLinks,
      ...(await serverSideTranslations(locale, [
        'pre-trip',
        'navbar',
        'footer',
        'common',
        'cookie',
      ])),
      sections,
    },
  };
}
