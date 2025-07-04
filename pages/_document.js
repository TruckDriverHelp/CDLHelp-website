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
    console.error('Failed to load critical CSS:', e);
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
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
