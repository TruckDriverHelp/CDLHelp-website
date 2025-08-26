// Critical CSS - loaded immediately
import '/public/css/bootstrap.min.css'; // Keep Bootstrap as it's critical for layout
import '/public/css/styles.css';
import '/public/css/main.css';
import '/public/css/fixes.css'; // CSS fixes for warnings
import '/public/css/cls-prevention.css'; // CLS prevention styles

// Component-specific CSS - loaded with components

// Dynamically import CSS for components that aren't always used
// Note: These styles are imported on-demand when Swiper components are used
// const loadSwiperStyles = () => {
//   import('../node_modules/swiper/swiper.min.css');
//   import('../node_modules/swiper/components/effect-cube/effect-cube.min.css');
//   import('../node_modules/swiper/components/effect-coverflow/effect-coverflow.min.css');
//   import('../node_modules/swiper/components/pagination/pagination.min.css');
//   import('../node_modules/swiper/components/navigation/navigation.min.css');
// };

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
import { useEffect, useState, Suspense, lazy, startTransition } from 'react';
import { QuizContextProvider } from '../store/quiz-context';
import nextI18NextConfig from '../next-i18next.config';
import analytics from '../lib/analytics';
import enhancedAnalytics from '../lib/analytics-enhanced';
import sessionContinuity from '../lib/session-continuity';
import consentManager from '../lib/consent-manager';
import { loadInterFont } from '../lib/fontLoader';
import { validatePublicEnvVars } from '../lib/env-validation';

// Lazy load non-critical components
const Layout = lazy(() => import('../components/_App/Layout'));
const Pixel = lazy(() => import('../components/Pixel'));
const SmartAppBanner = lazy(() => import('../components/_App/SmartAppBanner'));
const CriticalStyles = lazy(() => import('../components/_App/CriticalStyles'));
const AsyncStyles = lazy(() => import('../components/_App/AsyncStyles'));

// Import cookie banner directly (not lazy) for better i18n reliability
import CookieConsentBanner from '../components/_App/CookieConsentBanner';
import HreflangValidator from '../components/SEO/HreflangValidator';
import { initCLSMonitoring, setupLazyLoadObserver } from '../lib/cls-monitor';

// Function to load non-critical CSS after initial render
const loadDeferredStyles = () => {
  const links = [
    '/css/fontawesome.min.css', // Font Awesome icons - can be deferred
    '/css/remixicon.css', // RemixIcon if it exists
  ].filter(() => {
    // Only include files that actually exist (for development)
    return true; // In production, assume files exist
  });

  links.forEach(href => {
    // Check if stylesheet already exists
    if (document.querySelector(`link[href="${href}"]`)) {
      return;
    }

    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = href;
    link.media = 'print'; // Initially load as print to avoid blocking
    link.onload = function () {
      this.media = 'all'; // Switch to all media after load
    };
    document.head.appendChild(link);
  });
};

const MyApp = ({ Component, pageProps }) => {
  const router = useRouter();
  const dir = getDirection(router.locale);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    startTransition(() => {
      setIsClient(true);
    });
    // Load Inter font asynchronously
    loadInterFont();

    // Load non-critical CSS after initial render
    if (document.readyState === 'complete') {
      loadDeferredStyles();
    } else {
      window.addEventListener('load', loadDeferredStyles);
    }

    // Validate environment variables in development
    if (process.env.NODE_ENV === 'development') {
      validatePublicEnvVars();
    }

    // Initialize CLS monitoring
    const disconnectCLS = initCLSMonitoring();

    // Set up lazy load observer for dynamic content
    setupLazyLoadObserver();

    // Prevent CLS from late-loading content
    const preventCLS = () => {
      // Set minimum heights for common containers
      const containers = document.querySelectorAll('[data-min-height]');
      containers.forEach(container => {
        const minHeight = container.getAttribute('data-min-height');
        container.style.minHeight = minHeight;
      });

      // Handle dynamic navigation height
      const nav = document.querySelector('nav');
      if (nav) {
        document.documentElement.style.setProperty('--nav-height', `${nav.offsetHeight}px`);
      }

      // Reserve space for images without dimensions
      const images = document.querySelectorAll('img:not([width]):not([height])');
      images.forEach(img => {
        if (img.naturalWidth && img.naturalHeight) {
          img.width = img.naturalWidth;
          img.height = img.naturalHeight;
        }
      });
    };

    // Run CLS prevention on initial load
    preventCLS();

    // Also run on route changes
    router.events.on('routeChangeComplete', preventCLS);

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

    // Initialize enhanced analytics with unified identity and session continuity
    if (consentManager.hasConsent('analytics')) {
      enhancedAnalytics.init().then(() => {
        // Initialize session continuity after analytics
        sessionContinuity.init();

        // Check for session restoration from mobile app
        sessionContinuity.restoreSessionFromApp();

        // Initialize legacy analytics for backward compatibility
        analytics.init();
      });
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

        // Enhanced unified tracking with session continuity
        enhancedAnalytics.trackPageView(url, document.title);
      }
    };

    router.events.on('routeChangeComplete', handleRouteChange);
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange);
      router.events.off('routeChangeComplete', preventCLS);
      if (disconnectCLS) disconnectCLS();
    };
  }, [router.events, router.pathname]);

  return (
    <QuizContextProvider>
      <Suspense fallback={null}>
        <CriticalStyles />
      </Suspense>
      <Suspense fallback={<div>Loading...</div>}>
        <Layout dir={dir}>
          {process.env.NODE_ENV === 'development' && <HreflangValidator />}
          <AsyncStyles />
          {isClient && consentManager.hasConsent('marketing') && (
            <Suspense fallback={null}>
              <Pixel name="FACEBOOK_PIXEL_ADVANCED" />
            </Suspense>
          )}
          {isClient && !['/404', '/cookies-policy'].includes(router.pathname) && (
            <CookieConsentBanner />
          )}
          <Suspense fallback={null}>
            <SmartAppBanner />
          </Suspense>
          <Component {...pageProps} />

          {/* Google Tag Manager - Load only with consent */}
          {isClient && process.env.NEXT_PUBLIC_GTM_ID && consentManager.hasConsent('analytics') && (
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

          {/* Google Analytics Scripts - Consent Mode already initialized in _document.js */}
          {isClient && process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS && (
            <>
              <Script
                strategy="afterInteractive"
                src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS}`}
              />
              <Script
                id="google-analytics-config"
                strategy="afterInteractive"
                dangerouslySetInnerHTML={{
                  __html: `
									// Configure Google Analytics after consent defaults are set
									if (typeof gtag === 'function') {
										gtag('js', new Date());
										gtag('config', '${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS}', {
											page_path: window.location.pathname,
										});
									}
								`,
                }}
              />
            </>
          )}

          {/* Google Ads - Load only with marketing consent */}
          {isClient &&
            process.env.NEXT_PUBLIC_GOOGLE_ADS_ID &&
            consentManager.hasConsent('marketing') && (
              <>
                <Script
                  strategy="afterInteractive"
                  src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GOOGLE_ADS_ID}`}
                />
                <Script
                  id="google-ads"
                  strategy="afterInteractive"
                  dangerouslySetInnerHTML={{
                    __html: `
                    window.dataLayer = window.dataLayer || [];
                    function gtag(){dataLayer.push(arguments);}
                    gtag('js', new Date());
                    
                    // Enable Enhanced Conversions
                    gtag('config', '${process.env.NEXT_PUBLIC_GOOGLE_ADS_ID}', {
                      'allow_enhanced_conversions': true
                    });
                  `,
                  }}
                />
              </>
            )}

          {/* Critical assets are already preloaded in _document.js */}
        </Layout>
      </Suspense>
    </QuizContextProvider>
  );
};

export default appWithTranslation(MyApp, nextI18NextConfig);
