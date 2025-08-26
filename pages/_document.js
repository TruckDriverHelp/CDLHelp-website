import Document, { Html, Head, Main, NextScript } from 'next/document';
import fs from 'fs';
import path from 'path';

// Read and minify critical CSS at build time
const criticalCSS = (() => {
  try {
    const cssPath = path.join(process.cwd(), 'public/css/critical.css');
    const css = fs.readFileSync(cssPath, 'utf8');
    return css
      .replace(/\/\*[\s\S]*?\*\//g, '')
      .replace(/\s+/g, ' ')
      .replace(/\s*{\s*/g, '{')
      .replace(/\s*}\s*/g, '}')
      .replace(/\s*:\s*/g, ':')
      .replace(/\s*;\s*/g, ';')
      .replace(/\s*,\s*/g, ',')
      .replace(/;}+/g, '}')
      .trim();
  } catch (e) {
    return '';
  }
})();

class MyDocument extends Document {
  static async getInitialProps(ctx) {
    const initialProps = await Document.getInitialProps(ctx);
    return { ...initialProps, locale: ctx.locale || 'en' }; // Ensure a default locale is set
  }

  render() {
    const { locale } = this.props;

    return (
      <Html lang={locale}>
        <Head>
          <link rel="icon" href="/images/favicon.ico" />
          <meta
            name="apple-itunes-app"
            content="app-id=6444388755, app-argument=https://cdlhelp.onelink.me/mHbW/mgvvp96d"
          />

          {/* DNS prefetch and preconnect for faster third-party resources */}
          <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
          <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
          <link rel="dns-prefetch" href="https://www.google-analytics.com" />
          <link rel="dns-prefetch" href="https://mc.yandex.ru" />

          {/* Preload critical resources with high priority */}
          <link
            rel="preload"
            as="image"
            href="/images/video/video-3-no-text.webp"
            type="image/webp"
            fetchpriority="high"
          />

          {/* Inter font loads asynchronously via fontLoader */}
          {/* Inline critical CSS for faster first paint */}
          <style
            dangerouslySetInnerHTML={{
              __html: criticalCSS,
            }}
          />

          {/* CryptoJS for Enhanced Conversions SHA-256 hashing */}
          <script 
            src="https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.1.1/crypto-js.min.js"
            integrity="sha512-E8QSvWZ0eCLGk4km3hxSsNmGWbLtSCSUcewDQPQWZF6pEU8GlT8a5fF32wOl1i8ftdMhssTrF/OhyGWwonTcXA=="
            crossOrigin="anonymous"
            referrerPolicy="no-referrer"
          />

          {/* Google Consent Mode v2 - Initialize before any tracking scripts */}
          <script
            dangerouslySetInnerHTML={{
              __html: `
                // Initialize dataLayer and gtag function FIRST
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                
                // Detect user region for consent defaults
                function detectRegion() {
                  // Check CloudFlare or similar geo headers first
                  const cfCountry = document.querySelector('meta[name="cf-country"]')?.content;
                  if (cfCountry) return cfCountry;
                  
                  // Fallback to timezone detection
                  const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
                  const euTimezones = ['Europe/', 'GB', 'UK'];
                  if (euTimezones.some(zone => tz.includes(zone))) {
                    return 'EU';
                  }
                  return 'US';
                }
                
                // Check if user is in privacy-strict region
                const strictRegions = ['EU', 'UK', 'CA', 'CH', 'EEA', 'GB'];
                const userRegion = detectRegion();
                const isStrictRegion = strictRegions.includes(userRegion);
                
                // Set default consent state - MUST happen before any tracking scripts load
                // Use region-based defaults for better compliance
                gtag('consent', 'default', {
                  'ad_storage': isStrictRegion ? 'denied' : 'denied', // Always denied by default for better privacy
                  'ad_user_data': isStrictRegion ? 'denied' : 'denied',
                  'ad_personalization': isStrictRegion ? 'denied' : 'denied',
                  'analytics_storage': isStrictRegion ? 'denied' : 'denied',
                  'functionality_storage': 'granted', // Always granted for necessary cookies
                  'personalization_storage': isStrictRegion ? 'denied' : 'denied',
                  'security_storage': 'granted', // Always granted for security
                  'wait_for_update': isStrictRegion ? 2000 : 500, // Longer wait for strict regions
                  'region': strictRegions // Apply to all strict regions
                });
                
                // Set debug flag from environment or query param
                if (typeof window !== 'undefined') {
                  const urlParams = new URLSearchParams(window.location.search);
                  if (urlParams.get('analytics_debug') === 'true' || 
                      '${process.env.NEXT_PUBLIC_ANALYTICS_DEBUG}' === 'true') {
                    window.__ANALYTICS_DEBUG__ = true;
                  }
                  
                  // Debug log consent initialization
                  if (window.__ANALYTICS_DEBUG__) {
                    console.log('🔒 Google Consent Mode V2 initialized', {
                      region: userRegion,
                      isStrictRegion: isStrictRegion,
                      defaults: 'denied (privacy-first)',
                      wait_for_update: isStrictRegion ? 2000 : 500
                    });
                  }
                }
              `,
            }}
          />

          {/* Preload key resources */}
          <link rel="preload" href="/css/bootstrap.min.css" as="style" />
          <link rel="preload" href="/css/styles.css" as="style" />
          <link rel="preload" href="/css/main.css" as="style" />

          {/* Yandex.Metrika counter - loads only with analytics consent */}
          <script
            dangerouslySetInnerHTML={{
              __html: `
                // Initialize Yandex.Metrica only when consent is granted
                function initYandexMetrica() {
                  (function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
                  m[i].l=1*new Date();
                  for (var j = 0; j < document.scripts.length; j++) {if (document.scripts[j].src === r) { return; }}
                  k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})
                  (window, document, "script", "https://mc.yandex.ru/metrika/tag.js", "ym");

                  ym(103287856, "init", {
                       clickmap:true,
                       trackLinks:true,
                       accurateTrackBounce:true,
                       webvisor:true
                  });
                }

                // Check for consent on load
                if (typeof window !== 'undefined') {
                  window.addEventListener('load', function() {
                    // Check if user has already consented
                    const consentCookie = document.cookie.split('; ').find(row => row.startsWith('cookieConsent='));
                    if (consentCookie) {
                      const consentValue = consentCookie.split('=')[1];
                      if (consentValue && consentValue !== 'rejected') {
                        try {
                          const consent = JSON.parse(decodeURIComponent(consentValue));
                          if (consent.analytics) {
                            initYandexMetrica();
                          }
                        } catch (e) {
                          // Legacy format - 'accepted' means all consents
                          if (consentValue === 'accepted') {
                            initYandexMetrica();
                          }
                        }
                      }
                    }
                  });

                  // Listen for consent changes
                  window.addEventListener('consentChanged', function(event) {
                    if (event.detail && event.detail.analytics) {
                      if (!window.ym) {
                        initYandexMetrica();
                      }
                    }
                  });
                }
              `,
            }}
          />
        </Head>
        <body>
          {/* Google Tag Manager (noscript) */}
          {process.env.NEXT_PUBLIC_GTM_ID && (
            <noscript>
              <iframe
                src={`https://www.googletagmanager.com/ns.html?id=${process.env.NEXT_PUBLIC_GTM_ID}`}
                height="0"
                width="0"
                style={{ display: 'none', visibility: 'hidden' }}
              />
            </noscript>
          )}
          {/* Yandex.Metrika noscript removed - requires consent which can't be checked without JavaScript */}
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
