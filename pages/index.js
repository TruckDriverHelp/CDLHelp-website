import React from 'react'
import MainBanner from '@/components/Home/MainBanner';
import BestFeatures from '@/components/Home/BestFeatures';
import AppIntroVideo from '@/components/Home/AppIntroVideo';
import Funfacts from '@/components/Home/Funfacts';
import AppDownload from '@/components/Home/AppDownload';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import getMeta from '../lib/getMeta';
import Navbar from "@/components/_App/Navbar";
import Footer from "@/components/_App/Footer";
import Layout from "@/components/_App/Layout";

const IndexPage = ({ meta, alternateLinks }) => {
    const { locale } = useRouter();
    return (
        <>
            <Head>
                <title>{meta.title}</title>
                <meta name="description" content={meta.description} />

                {/* Google / Search Engine Tags */}
                <meta itemProp="name" content={meta.title} />
                <meta itemProp="description" content={meta.description} />
                <meta itemProp="image" content={meta.image} />

                {/* Facebook Meta Tags */}
                <meta property="og:url" content="https://www.cdlhelp.com" />
                <meta property="og:type" content="website" />
                <meta property="og:title" content={meta.title} />
                <meta property="og:description" content={meta.description} />
                <meta property="og:image" content={meta.image} />
                <meta property="og:locale" content={locale} />
                <meta property="og:site_name" content="CDL Help" />

                {/* Twitter Meta Tags */}
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content={meta.title} />
                <meta name="twitter:description" content={meta.description} />
                <meta name="twitter:image" content={meta.image} />

                <link rel="canonical" href="https://www.cdlhelp.com/" />
                
            </Head>

            <Layout>
                <Navbar alternateLinks={alternateLinks} />
                <MainBanner />

                <AppIntroVideo />

                <BestFeatures />
                {/* <ClientFeedback /> */}

                {/* <TopFeatures /> */}

                {/* <AboutContent /> */}

                {/* <KeyFeatures /> */}

                {/* <AppScreenshots /> */}

                <Funfacts />

                <AppDownload />


                {/* <PricingPlan /> 
                            
                            <div className="bg-f9f9f9">
                    <PartnerStyle2 />
                </div>

                <BlogPost /> */}
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