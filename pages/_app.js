import '@/public/css/bootstrap.min.css'
import '@/public/css/fontawesome.min.css'
import '@/public/css/remixicon.css'
import '@/public/css/animate.min.css'
import '../node_modules/swiper/swiper.min.css'
import '../node_modules/swiper/components/effect-cube/effect-cube.min.css'
import '../node_modules/swiper/components/effect-coverflow/effect-coverflow.min.css'
import '../node_modules/swiper/components/pagination/pagination.min.css'
import '../node_modules/swiper/components/navigation/navigation.min.css'
import '../node_modules/react-modal-video/css/modal-video.min.css'
import 'react-accessible-accordion/dist/fancy-example.css'
import 'react-image-lightbox/style.css'
import 'react-tabs/style/react-tabs.css'
// Global CSS
import '@/public/css/styles.css'
import Script from "next/script";
import { useRouter } from 'next/router'
import Pixel from '../components/Pixel'

import Layout from '@/components/_App/Layout';
import { useEffect } from 'react'

import JsonLd from '@/components/Schema/jsonld';

const website = {
    "@context": "https://schema.org/",
    "@type": "WebSite",
    "name": "CDL Help",
    "url": "https://cdlhelp.com/"
}

const videoObject = {
    "@context": "https://schema.org/",
    "@type": "VideoObject",
    "name": "Как получить CDL в 2024 году - пошаговая инструкция - CDL Help",
    "description": "В этом видео мы рассмотрим, как стать дальнобойщиком в США и подробно объясним, как получить CDL: 1. Пройдите медицинский осмотр DOT у сертифицированного специалиста 2. Сдайте теоретические тесты в DMV и получите ученическое разрешение (Commercial Learner&apos; Permit) 3. Пройдите обучение в школе CDL и сдайте практический экзамен по вождению",
    "thumbnailUrl": "https://www.youtube.com/watch?v=Ll4yVz7yBlQ",
    "uploadDate": "2023-11-23T00:00:00.000Z",
    "contentUrl": "https://www.youtube.com/watch?v=Ll4yVz7yBlQ",
    "duration": "PT00H33M19S"
  }

const offer = {
  "@context": "https://schema.org",
  "@type": "Offer",
  "url": "https://cdlhelp.com/#download",
  "priceCurrency": "USD",
  "price": "0.00",
  "itemOffered": {
    "@type": "MobileApplication",
    "name": "CDL Help",
    "operatingSystem": "iOS/Android",
    "applicationCategory": "EducationApplication",
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.6",
      "reviewCount": "3241"
    },
    "offers": {
      "@type": "Offer",
      "priceCurrency": "USD",
      "price": "0.00"
    }
  },
  "seller": {
    "@type": "Organization",
    "name": "CDL Help",
    "url": "https://cdlhelp.com"
  },
  "availability": "https://schema.org/InStock",
  "validFrom": "2024-01-01"
}


const mobileApplication = {
    "@context": "https://schema.org/",
    "@type": "MobileApplication",
    "name": "CDL Help",
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.6",
      "ratingCount": "3251"
    },
    "applicationCategory": "EducationalApplication",
    "offers": offer,
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

const breadcrumblist = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    {
      "@type": "ListItem",
      "position": 1,
      "name": "Home",
      "item": "https://dev.cdlhelp.com/"
    },
    {
      "@type": "ListItem",
      "position": 2,
      "name": "FAQ",
      "item": "https://dev.cdlhelp.com/faq"
    },
    {
      "@type": "ListItem",
      "position": 3,
      "name": "CDL школы",
      "item": "https://dev.cdlhelp.com/cdl-shkola"
    },
    {
      "@type": "ListItem",
      "position": 4,
      "name": "Получение пермита",
      "item": "https://dev.cdlhelp.com/permit"
    },
    {
      "@type": "ListItem",
      "position": 5,
      "name": "Как использовать приложение CDL Help",
      "item": "https://dev.cdlhelp.com/kak-ispolzovat-cdl-help"
    },
    {
      "@type": "ListItem",
      "position": 6,
      "name": "Политика конфиденциальности",
      "item": "https://dev.cdlhelp.com/privacy-policy"
    },
    {
      "@type": "ListItem",
      "position": 7,
      "name": "Как стать дальнобойщиков",
      "item": "https://dev.cdlhelp.com/dalnoboishik"
    },
    {
      "@type": "ListItem",
      "position": 8,
      "name": "Условия пользования",
      "item": "https://dev.cdlhelp.com/terms-conditions"
    },
    {
      "@type": "ListItem",
      "position": 9,
      "name": "CDL Техас",
      "item": "https://dev.cdlhelp.com/cdl-texas"
    },
    {
      "@type": "ListItem",
      "position": 10,
      "name": "Как получить CDL",
      "item": "https://dev.cdlhelp.com/kak-poluchit-cdl"
    },
    {
      "@type": "ListItem",
      "position": 11,
      "name": "О CDL школах",
      "item": "https://dev.cdlhelp.com/o-shkolax"
    }
  ]
}


const MyApp = ({ Component, pageProps }) => {
	const router = useRouter()

	useEffect(() => {
		const handleRouteChange = url => {
			window.gtag('config', process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS, {
				page_path: url,
				cookieFlags: 'SameSite=None; Secure'
			})
		}
		//var Tawk_API = Tawk_API || {}, Tawk_LoadStart = new Date();
		//(function () {
		//	var s1 = document.createElement("script"), s0 = document.getElementsByTagName("script")[0];
		//	s1.async = true;
		//	s1.src = 'https://embed.tawk.to/6384bd8cdaff0e1306d9d545/1giv88r02';
		//	s1.charset = 'UTF-8';
		//	s1.setAttribute('crossorigin', '*');
		//	s0.parentNode.insertBefore(s1, s0)
		//})();
		return () => {
			router.events.off('routeChangeComplete', handleRouteChange)
		}
	}, [router.events])

	return (
		<Layout>
      {/* Schema.org */}
			<JsonLd jsonld={website} />
			<JsonLd jsonld={videoObject} />
			<JsonLd jsonld={mobileApplication} />
			<JsonLd jsonld={organization} />
			<JsonLd jsonld={breadcrumblist} />

			<Pixel name='FACEBOOK_PIXEL_1' />
			<Component {...pageProps} />
			{/* Google analytics scripts */}
			<Script
				strategy="lazyOnload"
				async
				src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS}`}
			/>
			<Script
				id="google-analytics"
				strategy="lazyOnload"
				dangerouslySetInnerHTML={{
					__html: `
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());
                  gtag('config', '${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS}', {
                    page_path: window.location.pathname,
                  });
                `,
				}}
			/>
		</Layout>
	)
}

export default MyApp;