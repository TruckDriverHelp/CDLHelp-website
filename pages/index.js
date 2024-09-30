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

const IndexPage = ({ meta }) => {
    const { locale } = useRouter();
    return (
        <>
            <Head>
                <title>{meta.title}</title>
                <meta name="description" content={meta.description} />

                {/* Google / Search Engine Tags */}
                <meta itemprop="name" content={meta.title} />
                <meta itemprop="description" content={meta.description} />
                <meta itemprop="image" content={meta.image} />

                {/* Facebook Meta Tags */}
                <meta property="og:url" content="https://www.cdlhelp.com" />
                <meta property="og:type" content="website" />
                <meta property="og:title" content={meta.title} />
                <meta property="og:description" content={meta.description} />
                <meta property="og:image" content={meta.image} />

                {/* Twitter Meta Tags */}
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content={meta.title} />
                <meta name="twitter:description" content={meta.description} />
                <meta name="twitter:image" content={meta.image} />

                <link rel="canonical" href="https://www.cdlhelp.com/" />

            </Head>

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
        </>
    )
}

export default IndexPage;

export async function getStaticProps({ locale }) {
	const meta = await getMeta(locale, "general");

    return {
      props: {
        meta: meta,
        ...(await serverSideTranslations(locale ?? 'en', [
            'index',
            'navbar',
            'footer',
            'cookie'
          ])),
      },
    };
  }