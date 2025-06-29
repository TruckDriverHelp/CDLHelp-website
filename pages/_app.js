import '/public/css/bootstrap.min.css'
import '/public/css/fontawesome.min.css'
import '/public/css/remixicon.css'
import '/public/css/animate.min.css'
import '../node_modules/swiper/swiper.min.css'
import '../node_modules/swiper/components/effect-cube/effect-cube.min.css'
import '../node_modules/swiper/components/effect-coverflow/effect-coverflow.min.css'
import '../node_modules/swiper/components/pagination/pagination.min.css'
import '../node_modules/swiper/components/navigation/navigation.min.css'
import '../node_modules/react-modal-video/css/modal-video.min.css'
import 'react-accessible-accordion/dist/fancy-example.css'
import 'yet-another-react-lightbox/styles.css'
import 'react-tabs/style/react-tabs.css'
// Global CSS
import '/public/css/styles.css'
import '/public/css/main.css'
import Script from "next/script";
import { useRouter } from 'next/router'
import { appWithTranslation } from 'next-i18next'
import { getDirection } from 'lib/getDirection'
import { useEffect, Suspense, lazy } from 'react'
import { QuizContextProvider } from '../store/quiz-context'
import nextI18NextConfig from '../next-i18next.config'
import analytics from '../lib/analytics'

// Lazy load non-critical components
const Layout = lazy(() => import('../components/_App/Layout'));
const Pixel = lazy(() => import('../components/Pixel'));
const CookieConsentBanner = lazy(() => import("../components/_App/CookieConsentBanner.js"));
const TawkTo = lazy(() => import("../components/_App/TawkTo.js"));
const SmartAppBanner = lazy(() => import('../components/_App/SmartAppBanner'));

const MyApp = ({ Component, pageProps, articles }) => {
	const router = useRouter()
	const dir = getDirection(router.locale)

	useEffect(() => {
		// Initialize unified analytics
		analytics.init();
		
		// Register service worker
		if ('serviceWorker' in navigator) {
			window.addEventListener('load', () => {
				navigator.serviceWorker.register('/sw.js').then(registration => {
					console.log('SW registered:', registration);
				}).catch(error => {
					console.log('SW registration failed:', error);
				});
			});
		}

		const handleRouteChange = url => {
			// Legacy Google Analytics tracking
			window.gtag('config', process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS, {
				page_path: url,
				cookieFlags: 'SameSite=None; Secure'
			})
			
			// Enhanced unified tracking
			analytics.trackPageView(url, document.title);
		}

		router.events.on('routeChangeComplete', handleRouteChange)
		return () => {
			router.events.off('routeChangeComplete', handleRouteChange)
		}
	}, [router.events])

	return (
		<QuizContextProvider>
			<Suspense fallback={<div>Loading...</div>}>
				<Layout dir={dir}>
					<Suspense fallback={null}>
						<Pixel name='FACEBOOK_PIXEL_1' />
					</Suspense>
					{!["/404", "/cookies-policy"].includes(router.pathname) && (
						<Suspense fallback={null}>
							<CookieConsentBanner />
						</Suspense>
					)}
					<Suspense fallback={null}>
						<SmartAppBanner />
					</Suspense>
					<Component {...pageProps} />
					
					{/* Analytics Scripts - Load after page becomes interactive */}
					<Script
						strategy="afterInteractive"
						src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS}`}
					/>
					<Script
						id="google-analytics"
						strategy="afterInteractive"
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

					{/* Tawk.to - Load on user interaction */}
					<Suspense fallback={null}>
						<TawkTo />
					</Suspense>

					{/* Preload critical assets */}
					<link rel="preload" href="/css/main.css" as="style" />
					<link rel="preload" href="/css/bootstrap.min.css" as="style" />
					<link rel="preload" href="/css/fontawesome.min.css" as="style" />
				</Layout>
			</Suspense>
		</QuizContextProvider>
	)
}

export default appWithTranslation(MyApp, nextI18NextConfig);
