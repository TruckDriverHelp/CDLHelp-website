import Document, { Html, Head, Main, NextScript } from 'next/document';

class MyDocument extends Document {
    render() {
        return (
            <Html lang="ru">
                <Head>
                    <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png"/>
                    <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png"/>
                    <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png"/>
                    <link rel="manifest" href="/site.webmanifest"/>
                    <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#5bbad5"/>
                    <meta name="msapplication-TileColor" content="#da532c"/>
                    <meta name="theme-color" content="#ffffff"/>
                    {/* HTML Meta Tags */}
                    <meta name="description" content="CDL Help - лучшее приложение с переводом CDL на русский в режиме реального времени. Лучший способ подготовки к сдачи тестов и обучению языка."/>

                    {/* Google / Search Engine Tags */}
                    <meta itemProp="name" content="Приложение CDL Help - Тесты CDL на русском языке"/>
                    <meta itemProp="description" content="CDL Help - лучшее приложение с переводом CDL на русский в режиме реального времени. Лучший способ подготовки к сдачи тестов и обучению языка."/>
                    <meta itemProp="image" content="https://cdlhelp.com/images/cdlhelp-tag.jpg"/>

                    {/* Facebook Meta Tags */}
                    <meta property="og:url" content="https://www.cdlhelp.com"/>
                    <meta property="og:type" content="website"/>
                    <meta property="og:title" content="Приложение CDL Help - Тесты CDL на русском языке"/>
                    <meta property="og:description" content="CDL Help - лучшее приложение с переводом CDL на русский в режиме реального времени. Лучший способ подготовки к сдачи тестов и обучению языка."/>
                    <meta property="og:image" content="https://cdlhelp.com/images/cdlhelp-tag.jpg"/>

                    {/* Twitter Meta Tags */}
                    <meta name="twitter:card" content="summary_large_image"/>
                    <meta name="twitter:title" content="Приложение CDL Help - Тесты CDL на русском языке"/>
                    <meta name="twitter:description" content="CDL Help - лучшее приложение с переводом CDL на русский в режиме реального времени. Лучший способ подготовки к сдачи тестов и обучению языка."/>
                    <meta name="twitter:image" content="https://cdlhelp.com/images/cdlhelp-tag.jpg"/>

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