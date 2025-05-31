import React from 'react'
import Head from 'next/head';
import { useRouter } from 'next/router';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import getMeta from '../lib/getMeta';
import Navbar from "../components/_App/Navbar";
import Footer from "../components/_App/Footer";
import Layout from "../components/_App/Layout";
import { useTranslation } from 'next-i18next';
import { DynamicQuiz, DynamicFaqSection } from '../components/_App/DynamicImports';
import dynamic from 'next/dynamic';

// Dynamically import non-critical components
const TopContainer = dynamic(() => import('../components/Home/TopContainer'), {
  loading: () => <div style={{ minHeight: '400px', background: '#f5f5f5' }}>Loading...</div>,
  ssr: true
});

// Preload critical components
const BestFeatures = dynamic(() => import('../components/Home/BestFeatures'), {
  loading: () => <div style={{ minHeight: '200px', background: '#f5f5f5' }}>Loading features...</div>,
  ssr: false
});

// Lazy load non-critical components
const AppIntroVideo = dynamic(() => import('../components/Home/AppIntroVideo'), {
  loading: () => <div style={{ minHeight: '300px', background: '#f5f5f5' }}>Loading video...</div>,
  ssr: false
});

const Funfacts = dynamic(() => import('../components/Home/Funfacts'), {
  loading: () => <div style={{ minHeight: '150px', background: '#f5f5f5' }}>Loading fun facts...</div>,
  ssr: false
});

const AppDownload = dynamic(() => import('../components/Home/AppDownload'), {
  loading: () => <div style={{ minHeight: '200px', background: '#f5f5f5' }}>Loading download section...</div>,
  ssr: false
});

const IndexPage = ({ meta, alternateLinks }) => {
    const { locale } = useRouter();
    const router = useRouter()
    const { t } = useTranslation("index");
    
    return (
        <>
            <Head>
                <title>{meta.title}</title>
                <meta name="description" content={meta.description} />

                {/* Preload critical assets */}
                <link 
                    rel="preload" 
                    href="/images/video/video-3-no-text.webp" 
                    as="image" 
                    type="image/webp"
                />

                <meta itemProp="name" content={meta.title} />
                <meta itemProp="description" content={meta.description} />
                <meta itemProp="image" content={"/images/truckdriverhelp-og.jpg"}  />

                <meta property="og:url" content="https://www.cdlhelp.com" />
                <meta property="og:type" content="website" />
                <meta property="og:title" content={meta.title} />
                <meta property="og:description" content={meta.description} />
                <meta property="og:image" content={"/images/truckdriverhelp-og.jpg"} />
                <meta property="og:locale" content={locale} />
                <meta property="og:site_name" content="CDL Help" />

                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content={meta.title} />
                <meta name="twitter:description" content={meta.description} />
                <meta name="twitter:image" content={"/images/truckdriverhelp-og.jpg"} />

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
                <TopContainer />
                {/* {router.locale === 'ru' || router.locale === 'uk' ? (
                <div style={{ backgroundColor: '#d3d2e4', padding: '40px 0px' }}>
                    <div style={{ maxWidth: '700px', margin: '0px auto 0px auto' }}>
                        <h2 style={{ textAlign: 'center', fontSize: '1.6rem' }}>{router.locale === 'ru' ? "Рекомендованная нами школа" : "Рекомендована нами школа"}</h2>
                        <p style={{ textAlign: 'center', fontSize: '1.2rem' }}>Jacksonville, Florida</p>
                        <div style={{ textAlign: 'center' }}>
                            <a href="tel:+19046590005" style={{ textDecoration: 'none', color: '#000', fontSize: '1.2rem' }}>+1 (904) 659-0005</a>
                        </div>
                    </div>
                </div>) : null} */}
                <div style={{ maxWidth: '700px', margin: '80px auto 40px auto' }}>
                    <h2 style={{ textAlign: 'center', fontSize: '1.6rem' }}>{t('trySampleQuestion')}</h2>
                </div>
                <DynamicQuiz />
                <AppIntroVideo />
                <Funfacts />
                <AppDownload />
                <DynamicFaqSection />
                <Footer />
            </Layout>
        </>
    )
}

export default IndexPage;

export async function getStaticProps({ locale }) {
    const meta = await getMeta(locale, "general");

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

    return {
        props: {
            meta: meta,
            alternateLinks: alternateLinks,
            ...(await serverSideTranslations(locale ?? 'en', [
                'index',
                'navbar',
                'footer',
                'cookie'
            ])),
        },
    };
}






