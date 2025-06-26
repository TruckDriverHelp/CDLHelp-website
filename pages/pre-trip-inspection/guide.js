import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import fs from 'fs';
import path from 'path';
import styles from '../../styles/PreTripInspection.module.css';
import Head from 'next/head';
import Layout from '../../components/_App/Layout';
import Navbar from '../../components/_App/Navbar';

export default function PreTripGuide({ sections, alternateLinks }) {
    const router = useRouter();
    const { t } = useTranslation(['pre-trip', 'common']);
    const locale = router.locale;

    const metaTitle = t('guide.title');
    const metaDescription = t('guide.intro');
    const metaImage = '/images/truckdriverhelp-og.jpg'; // You may want to move this to translations as well

    return (
        <>
            <Head>
                <title>{metaTitle}</title>
                <meta name="description" content={metaDescription} />

                <meta itemProp="name" content={metaTitle} />
                <meta itemProp="description" content={metaDescription} />
                <meta itemProp="image" content={metaImage} />

                <meta property="og:url" content="https://www.cdlhelp.com" />
                <meta property="og:type" content="website" />
                <meta property="og:title" content={metaTitle} />
                <meta property="og:description" content={metaDescription} />
                <meta property="og:image" content={metaImage} />
                <meta property="og:locale" content={locale} />
                <meta property="og:site_name" content="CDL Help" />

                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content={metaTitle} />
                <meta name="twitter:description" content={metaDescription} />
                <meta name="twitter:image" content={metaImage} />

                <link rel="canonical" href="https://www.cdlhelp.com/" />
                <link rel="alternate" href="https://www.cdlhelp.com/" hrefLang="x-default" />
                <link rel="alternate" href="https://www.cdlhelp.com/en/" hrefLang="en" />
                <link rel="alternate" href="https://www.cdlhelp.com/ru/" hrefLang="ru" />
                <link rel="alternate" href="https://www.cdlhelp.com/uk/" hrefLang="uk" />
                <link rel="alternate" href="https://www.cdlhelp.com/ar/" hrefLang="ar" />
                <link rel="alternate" href="https://www.cdlhelp.com/ko/" hrefLang="ko" />
                <link rel="alternate" href="https://www.cdlhelp.com/tr/" hrefLang="tr" />
                <link rel="alternate" href="https://www.cdlhelp.com/pt/" hrefLang="pt" />
                <link rel="alternate" href="https://www.cdlhelp.com/zh/" hrefLang="zh" />
            </Head>

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
                    {sections.map((section) => (
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
        'en': '/',
        'ar': '/ar/',
        'ru': '/ru/',
        'uk': '/uk/',
        'zh': '/zh/',
        'ko': '/ko/',
        'tr': '/tr/',
        'pt': '/pt/'
    };

    const sections = files.map(file => {
        const fileNumber = parseInt(file.split('-')[0]);
        const fileSlug = file.split('-').slice(1).join('-').replace('.json', '');
        const fileContents = fs.readFileSync(path.join(preTripDir, file), 'utf8');
        const data = JSON.parse(fileContents);

        return {
            number: fileNumber,
            slug: fileSlug,
            name: data.name
        };
    }).sort((a, b) => a.number - b.number);

    return {
        props: {
            alternateLinks: alternateLinks,
            ...(await serverSideTranslations(locale, ['pre-trip', 'navbar', 'footer', 'common'])),
            sections
        }
    };
} 