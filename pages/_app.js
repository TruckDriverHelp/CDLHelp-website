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
import { appWithTranslation } from 'next-i18next'
import { getDirection } from 'lib/getDirection'
import CookieConsentBanner from "../components/_App/CookieConsentBanner.js"
import Layout from '@/components/_App/Layout';
import { useEffect } from 'react'
import { QuizContextProvider } from '../store/quiz-context'

const saveUtmParams = () => {
    if (typeof window !== "undefined") {
        const urlParams = new URLSearchParams(window.location.search);
        const utmParams = {};

        ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content"].forEach(param => {
            if (urlParams.has(param)) {
                utmParams[param] = urlParams.get(param);
            }
        });

        // Store UTM data in localStorage if present
        if (Object.keys(utmParams).length > 0) {
            localStorage.setItem("utm_data", JSON.stringify(utmParams));
        }
    }
};

// Function to clean up UTM parameters from the URL
const cleanUpUtmParams = () => {
    if (typeof window !== "undefined" && window.location.search.includes("utm_")) {
        const url = new URL(window.location);
        url.searchParams.forEach((_, key) => {
            if (key.startsWith("utm_")) url.searchParams.delete(key);
        });
        window.history.replaceState({}, document.title, url.pathname + url.search);
    }
};

const MyApp = ({ Component, pageProps, articles }) => {
    const router = useRouter();
    const dir = getDirection(router.locale);

    useEffect(() => {
        saveUtmParams();
        cleanUpUtmParams();
    }, []);

    useEffect(() => {
        const handleRouteChange = url => {
            window.gtag('config', process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS, {
                page_path: url,
                cookieFlags: 'SameSite=None; Secure'
            });
        };

        router.events.on('routeChangeComplete', handleRouteChange);
        return () => {
            router.events.off('routeChangeComplete', handleRouteChange);
        };
    }, [router.events]);

    return (
        <QuizContextProvider>
            <Layout dir={dir}>
                <Pixel name='FACEBOOK_PIXEL_1' />
                {!["/404", "/cookies-policy"].includes(router.pathname) && <CookieConsentBanner />}
                <Component {...pageProps} />
                {/* Google Analytics Scripts */}
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
        </QuizContextProvider>
    );
};

export default appWithTranslation(MyApp);
