import React from 'react'
import Navbar from '@/components/_App/Navbar'
import MainBanner from '@/components/Home/MainBanner';
import BestFeatures from '@/components/Home/BestFeatures';
import AppIntroVideo from '@/components/Home/AppIntroVideo';
import Funfacts from '@/components/Home/Funfacts';
import AppDownload from '@/components/Home/AppDownload';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'

const IndexPage = ({ articles }) => {
    return (
        <>
            <Head>
                <link rel="canonical" href="https://www.cdlhelp.com/" />
                <title>{title}</title>

                {/* Google / Search Engine Tags */}
                <meta name="name" content={title} />
                <meta name="description" content={description} />
                <meta name="image" content="https://cdlhelp.com/images/cdlhelp-tag.jpg" />

                {/* Facebook Meta Tags */}
                <meta property="og:url" content="https://www.cdlhelp.com" />
                <meta property="og:type" content="article" />
                <meta property="og:title" content={title} />
                <meta property="og:description" content={description} />
                <meta property="og:image" content="https://cdlhelp.com/images/cdlhelp-tag.jpg" />

                {/* Twitter Meta Tags */}
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content={title} />
                <meta name="twitter:description" content={description} />
                <meta name="twitter:image" content="https://cdlhelp.com/images/cdlhelp-tag.jpg" />
            
            </Head>
            <Navbar articles={articles} />

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