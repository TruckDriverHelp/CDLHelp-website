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
                    <link rel="icon" href="/images/favicon.ico"></link>
                    <FACEBOOK_PIXEL_1 />
                    
                </Head>
                <body>
                    <Main />
                    <NextScript />
                </body>

            </Html>
        )
    }
}

export default MyDocument;