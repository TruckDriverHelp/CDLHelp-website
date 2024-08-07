import Document, { Html, Head, Main, NextScript } from 'next/document';

class MyDocument extends Document {
    render() {
        return (
            <Html lang="ru">
                <Head>
                    <script
                        dangerouslySetInnerHTML={{
                            __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','GTM-NN4L7T24');`,
                        }}
                    />

                    <link rel="apple-touch-icon" sizes="180x180" href="/images/apple-touch-icon.png" />
                    <link rel="icon" type="image/png" sizes="32x32" href="/images/favicon-32x32.png" />
                    <link rel="icon" type="image/png" sizes="16x16" href="/images/favicon-16x16.png" />
                    <link rel="manifest" href="/images/site.webmanifest" />
                    <link rel="mask-icon" href="/images/safari-pinned-tab.svg" color="#5bbad5" />
                    <meta name="msapplication-TileColor" content="#da532c" />
                    <meta name="theme-color" content="#ffffff" />
                    {/* HTML Meta Tags */}

                    {/* Google / Search Engine Tags */}
                    <meta itemProp="name" content="Приложение CDL Help - Тесты CDL на русском языке" />
                    <meta itemProp="description" content="CDL Help - лучшее приложение с переводом CDL на русский в режиме реального времени. Лучший способ подготовки к сдачи тестов и обучению языка." />
                    <meta itemProp="image" content="https://cdlhelp.com/images/cdlhelp-tag.jpg" />

                    {/* Facebook Meta Tags */}
                    <meta property="og:url" content="https://www.cdlhelp.com" />
                    <meta property="og:type" content="website" />
                    <meta property="og:title" content="Приложение CDL Help - Тесты CDL на русском языке" />
                    <meta property="og:description" content="CDL Help - лучшее приложение с переводом CDL на русский в режиме реального времени. Лучший способ подготовки к сдачи тестов и обучению языка." />
                    <meta property="og:image" content="https://cdlhelp.com/images/cdlhelp-tag.jpg" />
                    <meta property='og:site_name' content="CDL Help" />

                    {/* Twitter Meta Tags */}
                    <meta name="twitter:card" content="summary_large_image" />
                    <meta name="twitter:title" content="Приложение CDL Help - Тесты CDL на русском языке" />
                    <meta name="twitter:description" content="CDL Help - лучшее приложение с переводом CDL на русский в режиме реального времени. Лучший способ подготовки к сдачи тестов и обучению языка." />
                    <meta name="twitter:image" content="https://cdlhelp.com/images/cdlhelp-tag.jpg" />

                </Head>
                <body>
                <noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-NN4L7T24" height="0" width="0" style={{display:"none",visibility:"hidden"}}></iframe></noscript>
                    <Main />
                    <NextScript />
                </body>

            </Html>
        )
    }
}

export default MyDocument;