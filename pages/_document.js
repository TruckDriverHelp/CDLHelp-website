import Document, { Html, Head, Main, NextScript } from 'next/document';
import Script from 'next/script'

class MyDocument extends Document {
    render() {
        return (
            <Html lang="ru">
                <Head>
                    <link rel="icon" href="/images/favicon.ico"></link>
                    {/* HTML Meta Tags */}
                    <meta name="description" content="CDL Help - лучшее приложение с переводом CDL на русский в режиме реального времени. Лучший способ подготовки к сдачи тестов и обучению языка."/>

                    {/* Google / Search Engine Tags */}
                    <meta itemProp="name" content="Приложение CDL Help - Тесты CDL на русском языке"/>
                    <meta itemProp="description" content="CDL Help - лучшее приложение с переводом CDL на русский в режиме реального времени. Лучший способ подготовки к сдачи тестов и обучению языка."/>
                    <meta itemProp="image" content="https://cdlhelp.app/images/cdlhelp-tag.jpg"/>

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
                    <script dangerouslySetInnerHTML={{
                        __html: `
                            !function(f,b,e,v,n,t,s)
                            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
                            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
                            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
                            n.queue=[];t=b.createElement(e);t.async=!0;
                            t.src=v;s=b.getElementsByTagName(e)[0];
                            s.parentNode.insertBefore(t,s)}(window,document,'script',
                            'https://connect.facebook.net/en_US/fbevents.js');
                            fbq('init', '766792617985084'); 
                            fbq('track', 'PageView');
                        `
                    }} />
                    <noscript>
                        <img height="1" width="1" style="display:none"
                            src="https://www.facebook.com/tr?id=766792617985084&ev=PageView&noscript=1" />
                    </noscript>
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