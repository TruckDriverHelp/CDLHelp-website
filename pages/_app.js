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
import Navbar from '@/components/_App/Navbar'
import Footer from '@/components/_App/Footer'
import { appWithTranslation } from 'next-i18next'
import { getDirection } from 'lib/getDirection'

import CookieConsentBanner from "../components/_App/CookieConsentBanner.js"

import Layout from '@/components/_App/Layout';
import { useEffect } from 'react'

const MyApp = ({ Component, pageProps, articles }) => {
	const router = useRouter()
	const dir = getDirection(router.locale)

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
			<div dir={dir}>
            <Navbar />

			<Pixel name='FACEBOOK_PIXEL_1' />
			{router.pathname != "/404" && <CookieConsentBanner />}
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
            <Footer />
			</div>
		</Layout>
	)
}

export default appWithTranslation(MyApp);
