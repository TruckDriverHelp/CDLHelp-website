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
    const title = "CDL Тесты с переводом 2024 – CDL Help"
    const description = "Перевод CDL тестов на русский язык. Полезные статьи и материалы об экзамене. Изучайте Английский язык во время подготовки."
    
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