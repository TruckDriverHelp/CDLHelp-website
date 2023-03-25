import Document, { Html, Head, Main, NextScript } from 'next/document';
import Script from 'next/script'

class MyDocument extends Document {
    render() {
        return (
            <Html lang="eng">
                <Head>
                <Script   id="google-tag-manager" strategy="afterInteractive">
                {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
                new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
                j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
                'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
                })(window,document,'script','dataLayer','GTM-KQW58WK');`}
                </Script>
                    <link rel="icon" href="/images/favicon.ico"></link>
                    <meta
                        name="description"
                        content="CDL Help это уникальное приложение с переводом CDL на русский в режиме реального времени. Лучший способ подготовки к сдачи тестов и обучению языка."
                        key="desc"
                    />
                </Head>
                <body>
                    <Main />
                    <NextScript />
                </body>
                <noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-KQW58WK"
                height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>

            </Html>
        )
    }
}

export default MyDocument;