import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import fs from 'fs';
import path from 'path';
import styles from '../../styles/PreTripInspection.module.css';
import { SEOHead } from '../../src/shared/ui/SEO';
import { SchemaBuilder } from '../../src/shared/ui/SEO/schemas';
import { StructuredData } from '../../src/shared/ui/SEO/StructuredData';
import Layout from '../../components/_App/Layout';
import Navbar from '../../components/_App/Navbar';

export default function PreTripGuide({ sections, alternateLinks }) {
  const router = useRouter();
  const { t } = useTranslation(['pre-trip', 'common']);
  const { locale } = router;

  const metaTitle = t('guide.title');
  const metaDescription = t('guide.intro');
  const metaImage = '/images/truckdriverhelp-og.jpg';

  // Build comprehensive schemas for pre-trip inspection guide
  const schemas = new SchemaBuilder(locale)
    .addOrganization({
      description: 'CDL Help - Free CDL practice tests and pre-trip inspection guides',
    })
    .addWebsite({
      description: 'CDL pre-trip inspection guide and training',
    })
    .addBreadcrumb([
      { name: t('common:home', 'Home'), url: '/' },
      { name: t('pre-trip.title', 'Pre-Trip Inspection'), url: '/pre-trip-inspection/guide' },
    ])
    .addHowTo({
      name: metaTitle || 'CDL Pre-Trip Inspection Guide',
      description:
        metaDescription || 'Complete guide to performing CDL pre-trip vehicle inspection',
      image: 'http://localhost:3001/images/pre-trip-inspection.jpg',
      totalTime: 'PT30M',
      estimatedCost: {
        '@type': 'MonetaryAmount',
        currency: 'USD',
        value: '0',
      },
      supply: [
        { '@type': 'HowToSupply', name: 'CDL permit or license' },
        { '@type': 'HowToSupply', name: 'Commercial vehicle' },
        { '@type': 'HowToSupply', name: 'Inspection checklist' },
      ],
      tool: [
        { '@type': 'HowToTool', name: 'Flashlight' },
        { '@type': 'HowToTool', name: 'Tire pressure gauge' },
        { '@type': 'HowToTool', name: 'Work gloves' },
      ],
      step: sections.map((section, index) => ({
        '@type': 'HowToStep',
        name: section.name.en || section.name.ru,
        text: `Inspect ${section.name.en || section.name.ru} components of the vehicle`,
        url: `https://www.cdlhelp.com${locale === 'en' ? '' : `/${locale}`}/pre-trip-inspection/${section.slug}/1`,
        position: index + 1,
      })),
    })
    .addCourse({
      name: 'CDL Pre-Trip Inspection Training',
      description: 'Learn how to perform a complete DOT pre-trip inspection',
      teaches: sections.map(s => s.name.en || s.name.ru),
      educationalLevel: 'Professional Certification',
      timeRequired: 'PT20H',
    })
    .addItemList({
      name: 'Pre-Trip Inspection Sections',
      description: 'All sections of the CDL pre-trip inspection',
      url: `https://www.cdlhelp.com${locale === 'en' ? '' : `/${locale}`}/pre-trip-inspection/guide`,
      numberOfItems: sections.length,
      itemListElement: sections.map((section, index) => ({
        '@type': 'ListItem',
        position: section.number,
        name: section.name.en || section.name.ru,
        url: `https://www.cdlhelp.com${locale === 'en' ? '' : `/${locale}`}/pre-trip-inspection/${section.slug}/1`,
      })),
    })
    .build();

  return (
    <>
      <SEOHead
        title={metaTitle}
        description={metaDescription}
        alternateLinks={alternateLinks}
        image={metaImage}
      />

      {/* Structured Data Schemas */}
      <StructuredData data={schemas} />

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
  const files = fs.readdirSync(preTripDir).filter(file => file.endsWith('.json'));
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
