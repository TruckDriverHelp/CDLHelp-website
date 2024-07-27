import React from 'react'
import Navbar from '@/components/_App/Navbar'
import MainBanner from '@/components/Home/MainBanner';
import BestFeatures from '@/components/Home/BestFeatures';
import AppIntroVideo from '@/components/Home/AppIntroVideo';
import Funfacts from '@/components/Home/Funfacts';
import AppDownload from '@/components/Home/AppDownload';
import Footer from '@/components/_App/Footer';
import Head from 'next/head';

import JsonLd from '@/components/Schema/jsonld';

const website = {
    "@context": "https://schema.org/",
    "@type": "WebSite",
    "name": "CDL Help",
    "url": "https://cdlhelp.com"
}

const videoObject = {
    "@context": "https://schema.org/",
    "@type": "VideoObject",
    "name": "Как получить CDL в 2024 году - пошаговая инструкция - CDL Help",
    "description": "В этом видео мы рассмотрим, как стать дальнобойщиком в США и подробно объясним, как получить CDL: 1. Пройдите медицинский осмотр DOT у сертифицированного специалиста 2. Сдайте теоретические тесты в DMV и получите ученическое разрешение (Commercial Learner's Permit) 3. Пройдите обучение в школе CDL и сдайте практический экзамен по вождению",
    "thumbnailUrl": "https://www.youtube.com/watch?v=Ll4yVz7yBlQ",
    "uploadDate": "2023-11-23T00:00:00.000Z",
    "contentUrl": "https://www.youtube.com/watch?v=Ll4yVz7yBlQ",
    "duration": "33:19"
  }

const softwareApplication = {
    "@context": "https://schema.org/",
    "@type": "SoftwareApplication",
    "name": "CDL Help",
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.6",
      "ratingCount": "3251"
    },
    "applicationCategory": "EducationalApplication",
    "operatingSystem": "Android, iOS"
  }

const organization = {
    "@context": "https://schema.org/",
    "@type": "Organization",
    "url": "https://cdlhelp.com/",
    "logo": "https://www.cdlhelp.com/_next/image/?url=%2Fimages%2Fblack-logo.png&w=256&q=75",
    "name": "CDL Help",
    "email": "contact@cdlhelp.com",
    "description": "CDL Тесты для Трак Драйверов США",
    "additionalType": "",
    "contactPoint": {
      "@type": "ContactPoint",
      "contactType": "Support",
      "contactOption": "Email"
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.6",
      "ratingCount": "3000",
      "reviewCount": "3000",
      "bestRating": "5",
      "worstRating": "2"
    }
  }


const IndexPage = () => {
    return (
        <>
            <Head>
                <link rel="canonical" href="https://www.cdlhelp.com/" />
                <title>Приложение CDL Help - CDL Тесты для Трак Драйверов США</title>
            </Head>
            
            <JsonLd jsonld={website} />
            <JsonLd jsonld={videoObject} />
            <JsonLd jsonld={softwareApplication} />
            <JsonLd jsonld={organization} />

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