import React from 'react'
import Navbar from '@/components/_App/Navbar'
import MainBanner from '@/components/Home/MainBanner';
import BestFeatures from '@/components/Home/BestFeatures';
import AppIntroVideo from '@/components/Home/AppIntroVideo';
import Funfacts from '@/components/Home/Funfacts';
import AppDownload from '@/components/Home/AppDownload';
import Footer from '@/components/_App/Footer';
import Head from 'next/head';

const IndexPage = () => {
    return (
        <>
				<Head>
					<link rel="canonical" href="https://www.cdlhelp.com/" />
					<title>Приложение CDL Help - Тесты CDL на русском языке</title>
				</Head>
            <Navbar />

            <MainBanner />

            <AppIntroVideo />

            <BestFeatures />

            {/* <ClientFeedback /> */}

            {/* <TopFeatures /> */}

            {/* <AboutContent /> */}

            {/* <KeyFeatures /> */}

            {/* <AppScreenshots /> */}


            {/* <Funfacts /> */}

            <AppDownload />


            {/* <PricingPlan /> 
						
						<div className="bg-f9f9f9">
                <PartnerStyle2 />
            </div>

            <BlogPost /> */}
 
            <Footer />
        </>
    )
}

export default IndexPage;