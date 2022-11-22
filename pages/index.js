import React from 'react'
import Navbar from '@/components/_App/Navbar'
import MainBanner from '@/components/Home/MainBanner';
import BestFeatures from '@/components/Home/BestFeatures';
import AppIntroVideo from '@/components/Home/AppIntroVideo';
import Funfacts from '@/components/Home/Funfacts';
import AppDownload from '@/components/Home/AppDownload';
import ClientFeedback from '@/components/Home/ClientFeedback';
import Footer from '@/components/_App/Footer';

const IndexPage8 = () => {
    return (
        <>
            <Navbar />

            <MainBanner />

            <BestFeatures />

            {/* <ClientFeedback /> */}

            {/* <TopFeatures /> */}

            {/* <AboutContent /> */}

            {/* <KeyFeatures /> */}

            {/* <AppScreenshots /> */}

            <AppIntroVideo />

            <Funfacts />

            <AppDownload />


            {/* <PricingPlan /> */}

            {/* <div className="bg-f9f9f9">
                <PartnerStyle2 />
            </div>

            <BlogPost /> */}
 
            <Footer />
        </>
    )
}

export default IndexPage8;