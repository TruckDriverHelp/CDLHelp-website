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
          <link
            rel="preload"
            as="image"
            href="/images/video/video-3-no-text.webp"
            type="image/webp"
          />
          {/* Inline critical CSS for faster first paint */}
          <style
            dangerouslySetInnerHTML={{
              __html: criticalCSS,
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
                    if (event.detail && event.detail.analytics && !window.ym) {
                      initYandexMetrica();
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
