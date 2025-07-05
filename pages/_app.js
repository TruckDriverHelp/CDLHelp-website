// Critical CSS - loaded immediately
import '/public/css/bootstrap.min.css'; // Keep Bootstrap as it's critical for layout
import '/public/css/styles.css';
import '/public/css/main.css';

// Component-specific CSS - loaded with components

// Dynamically import CSS for components that aren't always used
const loadSwiperStyles = () => {
  import('../node_modules/swiper/swiper.min.css');
  import('../node_modules/swiper/components/effect-cube/effect-cube.min.css');
  import('../node_modules/swiper/components/effect-coverflow/effect-coverflow.min.css');
  import('../node_modules/swiper/components/pagination/pagination.min.css');
  import('../node_modules/swiper/components/navigation/navigation.min.css');
};

const loadModalStyles = () => {
  import('../node_modules/react-modal-video/css/modal-video.min.css');
};

const loadAccordionStyles = () => {
  import('react-accessible-accordion/dist/fancy-example.css');
};

const loadLightboxStyles = () => {
  import('yet-another-react-lightbox/styles.css');
};

const loadTabStyles = () => {
  import('react-tabs/style/react-tabs.css');
};
import Script from 'next/script';
import { useRouter } from 'next/router';
import { appWithTranslation } from 'next-i18next';
import { getDirection } from 'lib/getDirection';
import { useEffect, Suspense, lazy } from 'react';
import { QuizContextProvider } from '../store/quiz-context';
import nextI18NextConfig from '../next-i18next.config';
import analytics from '../lib/analytics';
import consentManager from '../lib/consent-manager';
import { loadInterFont } from '../lib/fontLoader';

// Lazy load non-critical components
const Layout = lazy(() => import('../components/_App/Layout'));
const Pixel = lazy(() => import('../components/Pixel'));
const CookieConsentBanner = lazy(() => import('../components/_App/CookieConsentBanner.js'));
const SmartAppBanner = lazy(() => import('../components/_App/SmartAppBanner'));
const CriticalStyles = lazy(() => import('../components/_App/CriticalStyles'));
const AsyncStyles = lazy(() => import('../components/_App/AsyncStyles'));

const MyApp = ({ Component, pageProps }) => {
  const router = useRouter();
  const dir = getDirection(router.locale);

  useEffect(() => {
    // Load Inter font asynchronously
    loadInterFont();

    // Load component styles on demand
    // Commented out Swiper styles since components are not being used
    // if (router.pathname.includes('swiper') || router.pathname === '/') {
    //   loadSwiperStyles();
    // }
    if (router.pathname.includes('modal')) {
      loadModalStyles();
    }
    if (router.pathname.includes('accordion')) {
      loadAccordionStyles();
    }
    if (router.pathname.includes('gallery')) {
      loadLightboxStyles();
    }
    if (router.pathname.includes('tab')) {
      loadTabStyles();
    }

    // Initialize consent manager
    consentManager.init();

    // Initialize unified analytics only if consent given
    if (consentManager.hasConsent('analytics')) {
      analytics.init();
    }

    // Register service worker
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker
          .register('/sw.js')
          .then(() => {
            // Service worker registered successfully
          })
          .catch(() => {
            // Service worker registration failed
          });
      });
    }

    const handleRouteChange = url => {
      // Only track if we have consent
      if (consentManager.hasConsent('analytics')) {
        // Legacy Google Analytics tracking
        if (window.gtag) {
          window.gtag('config', process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS, {
            page_path: url,
            cookieFlags: 'SameSite=None; Secure',
          });
        }

        // Enhanced unified tracking
        analytics.trackPageView(url, document.title);
      }
    };

    router.events.on('routeChangeComplete', handleRouteChange);
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange);
    };
  }, [router.events, router.pathname]);

  return (
    <QuizContextProvider>
      <Suspense fallback={null}>
        <CriticalStyles />
      </Suspense>
      <Suspense fallback={<div>Loading...</div>}>
        <Layout dir={dir}>
          <AsyncStyles />
          {consentManager.hasConsent('marketing') && (
            <Suspense fallback={null}>
              <Pixel name="FACEBOOK_PIXEL_1" />
            </Suspense>
          )}
          {!['/404', '/cookies-policy'].includes(router.pathname) && (
            <Suspense fallback={null}>
              <CookieConsentBanner />
            </Suspense>
          )}
          <Suspense fallback={null}>
            <SmartAppBanner />
          </Suspense>
          <Component {...pageProps} />

          {/* Google Tag Manager - Load only with consent */}
          {process.env.NEXT_PUBLIC_GTM_ID && consentManager.hasConsent('analytics') && (
            <>
              <Script
                id="google-tag-manager"
                strategy="afterInteractive"
                dangerouslySetInnerHTML={{
                  __html: `
									(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
									new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
									j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
									'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
									})(window,document,'script','dataLayer','${process.env.NEXT_PUBLIC_GTM_ID}');
								`,
                }}
              />
              {/* GTM noscript fallback */}
              <noscript>
                <iframe
                  src={`https://www.googletagmanager.com/ns.html?id=${process.env.NEXT_PUBLIC_GTM_ID}`}
                  height="0"
                  width="0"
                  style={{ display: 'none', visibility: 'hidden' }}
                />
              </noscript>
            </>
          )}

          {/* Analytics Scripts - Load only with consent */}
          {consentManager.hasConsent('analytics') && (
            <>
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
            </>
          )}

          {/* Preload critical assets */}
          <link rel="preload" href="/css/main.css" as="style" />
          <link rel="preload" href="/css/bootstrap.min.css" as="style" />
          <link rel="preload" href="/css/fontawesome.min.css" as="style" />
        </Layout>
      </Suspense>
    </QuizContextProvider>
  );
};

export default appWithTranslation(MyApp, nextI18NextConfig);
