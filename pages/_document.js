import Document, { Html, Head, Main, NextScript } from 'next/document';
import Script from 'next/script'

class MyDocument extends Document {
    render() {
        return (
            <Html lang="eng">
                <Head>
                    <link rel="icon" href="/images/favicon.ico"></link>
                    {/* HTML Meta Tags */}
                    <title>Приложение CDL Help - Тесты CDL на русском языке</title>
                    <meta name="description" content="CDL Help - лучшее приложение с переводом CDL на русский в режиме реального времени. Лучший способ подготовки к сдачи тестов и обучению языка."/>

                    {/* Google / Search Engine Tags */}
                    <meta itemprop="name" content="Приложение CDL Help - Тесты CDL на русском языке"/>
                    <meta itemprop="description" content="CDL Help - лучшее приложение с переводом CDL на русский в режиме реального времени. Лучший способ подготовки к сдачи тестов и обучению языка."/>
                    <meta itemprop="image" content="https://cdlhelp.app/images/cdlhelp-tag.jpg"/>

                    {/* Facebook Meta Tags */}
                    <meta property="og:url" content="https://www.cdlhelp.app"/>
                    <meta property="og:type" content="website"/>
                    <meta property="og:title" content="Приложение CDL Help - Тесты CDL на русском языке"/>
                    <meta property="og:description" content="CDL Help - лучшее приложение с переводом CDL на русский в режиме реального времени. Лучший способ подготовки к сдачи тестов и обучению языка."/>
                    <meta property="og:image" content="https://cdlhelp.app/images/cdlhelp-tag.jpg"/>

                    {/* Twitter Meta Tags */}
                    <meta name="twitter:card" content="summary_large_image"/>
                    <meta name="twitter:title" content="Приложение CDL Help - Тесты CDL на русском языке"/>
                    <meta name="twitter:description" content="CDL Help - лучшее приложение с переводом CDL на русский в режиме реального времени. Лучший способ подготовки к сдачи тестов и обучению языка."/>
                    <meta name="twitter:image" content="https://cdlhelp.app/images/cdlhelp-tag.jpg"/>

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