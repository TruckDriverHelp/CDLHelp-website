import Document, { Html, Head, Main, NextScript } from 'next/document';
import FACEBOOK_PIXEL_1 from "components/Pixel/facebook/pixel-1"


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
                    <FACEBOOK_PIXEL_1 />
                    
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
        )
    }
}

export default MyDocument;